-- Create inventory_stock table for single-warehouse stock balances.
-- One row per SKU; linked to public.skus via primary-key foreign key.

CREATE TABLE IF NOT EXISTS public.inventory_stock (
  sku_id uuid PRIMARY KEY REFERENCES public.skus(id) ON DELETE CASCADE,
  on_hand_qty numeric(12,2) NOT NULL DEFAULT 0 CHECK (on_hand_qty >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inventory_stock_updated_at_idx
  ON public.inventory_stock (updated_at DESC);

-- Keep updated_at current on updates.
CREATE OR REPLACE FUNCTION public.set_inventory_stock_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS inventory_stock_set_updated_at ON public.inventory_stock;

CREATE TRIGGER inventory_stock_set_updated_at
BEFORE UPDATE ON public.inventory_stock
FOR EACH ROW
EXECUTE FUNCTION public.set_inventory_stock_updated_at();

-- Auto-create stock row whenever a new SKU is added.
CREATE OR REPLACE FUNCTION public.create_inventory_stock_for_new_sku()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.inventory_stock (sku_id)
  VALUES (NEW.id)
  ON CONFLICT (sku_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS skus_create_inventory_stock ON public.skus;

CREATE TRIGGER skus_create_inventory_stock
AFTER INSERT ON public.skus
FOR EACH ROW
EXECUTE FUNCTION public.create_inventory_stock_for_new_sku();

-- Backfill stock rows for existing SKUs.
INSERT INTO public.inventory_stock (sku_id)
SELECT s.id
FROM public.skus s
ON CONFLICT (sku_id) DO NOTHING;

-- RLS policies
ALTER TABLE public.inventory_stock ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS inventory_stock_select_ops_roles ON public.inventory_stock;
DROP POLICY IF EXISTS inventory_stock_insert_ops_roles ON public.inventory_stock;
DROP POLICY IF EXISTS inventory_stock_update_ops_roles ON public.inventory_stock;
DROP POLICY IF EXISTS inventory_stock_delete_super_admin ON public.inventory_stock;

CREATE POLICY inventory_stock_select_ops_roles
ON public.inventory_stock
FOR SELECT
TO authenticated
USING (
  public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager']
  )
);

CREATE POLICY inventory_stock_insert_ops_roles
ON public.inventory_stock
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager']
  )
);

CREATE POLICY inventory_stock_update_ops_roles
ON public.inventory_stock
FOR UPDATE
TO authenticated
USING (
  public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager']
  )
)
WITH CHECK (
  public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager']
  )
);

CREATE POLICY inventory_stock_delete_super_admin
ON public.inventory_stock
FOR DELETE
TO authenticated
USING (
  public.current_user_has_any_role(ARRAY['super_admin'])
);
