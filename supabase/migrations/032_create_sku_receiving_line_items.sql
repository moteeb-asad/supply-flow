-- Create SKU receiving line-items table, integrity checks, trigger, and RBAC policies.

CREATE TABLE IF NOT EXISTS public.sku_receiving_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_receiving_id uuid NOT NULL REFERENCES public.sku_receivings(id) ON DELETE CASCADE,
  purchase_order_item_id uuid NOT NULL REFERENCES public.purchase_order_items(id) ON DELETE RESTRICT,
  sku_id uuid NOT NULL REFERENCES public.skus(id) ON DELETE RESTRICT,
  qty_received numeric(12,2) NOT NULL DEFAULT 0 CHECK (qty_received >= 0),
  qty_rejected numeric(12,2) NOT NULL DEFAULT 0 CHECK (qty_rejected >= 0),
  variance_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sku_receiving_line_items_unique_receiving_po_item UNIQUE (sku_receiving_id, purchase_order_item_id)
);

CREATE INDEX IF NOT EXISTS sku_receiving_line_items_receiving_id_idx
  ON public.sku_receiving_line_items (sku_receiving_id);

CREATE INDEX IF NOT EXISTS sku_receiving_line_items_po_item_id_idx
  ON public.sku_receiving_line_items (purchase_order_item_id);

CREATE INDEX IF NOT EXISTS sku_receiving_line_items_sku_id_idx
  ON public.sku_receiving_line_items (sku_id);

CREATE OR REPLACE FUNCTION public.set_sku_receiving_line_item_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sku_receiving_line_items_set_updated_at ON public.sku_receiving_line_items;

CREATE TRIGGER sku_receiving_line_items_set_updated_at
BEFORE UPDATE ON public.sku_receiving_line_items
FOR EACH ROW
EXECUTE FUNCTION public.set_sku_receiving_line_item_updated_at();

CREATE OR REPLACE FUNCTION public.validate_sku_receiving_line_item_consistency()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_receiving_purchase_order_id uuid;
  v_po_item_purchase_order_id uuid;
  v_po_item_sku_id uuid;
BEGIN
  SELECT sr.purchase_order_id
  INTO v_receiving_purchase_order_id
  FROM public.sku_receivings sr
  WHERE sr.id = NEW.sku_receiving_id;

  IF v_receiving_purchase_order_id IS NULL THEN
    RAISE EXCEPTION 'sku_receiving_id % does not exist', NEW.sku_receiving_id;
  END IF;

  SELECT poi.purchase_order_id, poi.sku_id
  INTO v_po_item_purchase_order_id, v_po_item_sku_id
  FROM public.purchase_order_items poi
  WHERE poi.id = NEW.purchase_order_item_id;

  IF v_po_item_purchase_order_id IS NULL THEN
    RAISE EXCEPTION 'purchase_order_item_id % does not exist', NEW.purchase_order_item_id;
  END IF;

  IF v_receiving_purchase_order_id <> v_po_item_purchase_order_id THEN
    RAISE EXCEPTION 'Line item purchase_order_item_id % does not belong to receiving header purchase_order_id', NEW.purchase_order_item_id;
  END IF;

  IF NEW.sku_id <> v_po_item_sku_id THEN
    RAISE EXCEPTION 'sku_id % does not match purchase_order_item.sku_id %', NEW.sku_id, v_po_item_sku_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sku_receiving_line_items_validate_consistency ON public.sku_receiving_line_items;

CREATE TRIGGER sku_receiving_line_items_validate_consistency
BEFORE INSERT OR UPDATE ON public.sku_receiving_line_items
FOR EACH ROW
EXECUTE FUNCTION public.validate_sku_receiving_line_item_consistency();

ALTER TABLE public.sku_receiving_line_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sku_receiving_line_items_select_ops_roles ON public.sku_receiving_line_items;
DROP POLICY IF EXISTS sku_receiving_line_items_insert_ops_roles ON public.sku_receiving_line_items;
DROP POLICY IF EXISTS sku_receiving_line_items_update_ops_roles ON public.sku_receiving_line_items;
DROP POLICY IF EXISTS sku_receiving_line_items_delete_super_admin ON public.sku_receiving_line_items;

CREATE POLICY sku_receiving_line_items_select_ops_roles
ON public.sku_receiving_line_items
FOR SELECT
TO authenticated
USING (
  public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager', 'store_keeper']
  )
);

CREATE POLICY sku_receiving_line_items_insert_ops_roles
ON public.sku_receiving_line_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.sku_receivings sr
    WHERE sr.id = sku_receiving_id
      AND (
        public.current_user_has_any_role(ARRAY['super_admin', 'operations_manager'])
        OR (
          public.current_user_has_any_role(ARRAY['store_keeper'])
          AND sr.received_by = auth.uid()
          AND sr.status IN ('pending', 'in_progress', 'partially_received')
        )
      )
  )
);

CREATE POLICY sku_receiving_line_items_update_ops_roles
ON public.sku_receiving_line_items
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.sku_receivings sr
    WHERE sr.id = sku_receiving_id
      AND (
        public.current_user_has_any_role(ARRAY['super_admin', 'operations_manager'])
        OR (
          public.current_user_has_any_role(ARRAY['store_keeper'])
          AND sr.received_by = auth.uid()
          AND sr.status IN ('pending', 'in_progress', 'partially_received')
        )
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.sku_receivings sr
    WHERE sr.id = sku_receiving_id
      AND (
        public.current_user_has_any_role(ARRAY['super_admin', 'operations_manager'])
        OR (
          public.current_user_has_any_role(ARRAY['store_keeper'])
          AND sr.received_by = auth.uid()
          AND sr.status IN ('pending', 'in_progress', 'partially_received')
        )
      )
  )
);

CREATE POLICY sku_receiving_line_items_delete_super_admin
ON public.sku_receiving_line_items
FOR DELETE
TO authenticated
USING (
  public.current_user_has_any_role(ARRAY['super_admin'])
);
