-- Create SKU receiving header table, trigger, and RBAC policies.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'sku_receiving_status'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.sku_receiving_status AS ENUM (
      'pending',
      'in_progress',
      'partially_received',
      'received',
      'variance_flagged',
      'overdue'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.sku_receivings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL REFERENCES public.purchase_orders(id) ON DELETE RESTRICT,
  receipt_datetime timestamptz NOT NULL DEFAULT now(),
  delivery_note_number text,
  received_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  receiving_location text NOT NULL,
  vehicle_ref text,
  status public.sku_receiving_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sku_receivings_purchase_order_id_idx
  ON public.sku_receivings (purchase_order_id);

CREATE INDEX IF NOT EXISTS sku_receivings_status_idx
  ON public.sku_receivings (status);

CREATE INDEX IF NOT EXISTS sku_receivings_received_by_idx
  ON public.sku_receivings (received_by);

CREATE INDEX IF NOT EXISTS sku_receivings_receipt_datetime_idx
  ON public.sku_receivings (receipt_datetime DESC);

CREATE OR REPLACE FUNCTION public.set_sku_receiving_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sku_receivings_set_updated_at ON public.sku_receivings;

CREATE TRIGGER sku_receivings_set_updated_at
BEFORE UPDATE ON public.sku_receivings
FOR EACH ROW
EXECUTE FUNCTION public.set_sku_receiving_updated_at();

ALTER TABLE public.sku_receivings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sku_receivings_select_ops_roles ON public.sku_receivings;
DROP POLICY IF EXISTS sku_receivings_insert_ops_roles ON public.sku_receivings;
DROP POLICY IF EXISTS sku_receivings_update_ops_roles ON public.sku_receivings;
DROP POLICY IF EXISTS sku_receivings_delete_super_admin ON public.sku_receivings;

CREATE POLICY sku_receivings_select_ops_roles
ON public.sku_receivings
FOR SELECT
TO authenticated
USING (
  public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager', 'store_keeper']
  )
);

CREATE POLICY sku_receivings_insert_ops_roles
ON public.sku_receivings
FOR INSERT
TO authenticated
WITH CHECK (
  received_by = auth.uid()
  AND public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager', 'store_keeper']
  )
);

CREATE POLICY sku_receivings_update_ops_roles
ON public.sku_receivings
FOR UPDATE
TO authenticated
USING (
  public.current_user_has_any_role(ARRAY['super_admin', 'operations_manager'])
  OR (
    public.current_user_has_any_role(ARRAY['store_keeper'])
    AND received_by = auth.uid()
    AND status IN ('pending', 'in_progress', 'partially_received')
  )
)
WITH CHECK (
  public.current_user_has_any_role(ARRAY['super_admin', 'operations_manager'])
  OR (
    public.current_user_has_any_role(ARRAY['store_keeper'])
    AND received_by = auth.uid()
    AND status IN ('pending', 'in_progress', 'partially_received')
  )
);

CREATE POLICY sku_receivings_delete_super_admin
ON public.sku_receivings
FOR DELETE
TO authenticated
USING (
  public.current_user_has_any_role(ARRAY['super_admin'])
);
