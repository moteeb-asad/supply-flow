-- Create SKU <-> Supplier mapping table.
-- Supports one primary supplier per SKU, with room for alternates.

BEGIN;

CREATE TABLE IF NOT EXISTS public.sku_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id uuid NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  is_primary boolean NOT NULL DEFAULT false,
  supplier_sku_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sku_suppliers_unique_sku_supplier UNIQUE (sku_id, supplier_id)
);

CREATE INDEX IF NOT EXISTS sku_suppliers_sku_id_idx
  ON public.sku_suppliers (sku_id);

CREATE INDEX IF NOT EXISTS sku_suppliers_supplier_id_idx
  ON public.sku_suppliers (supplier_id);

CREATE UNIQUE INDEX IF NOT EXISTS sku_suppliers_one_primary_per_sku_idx
  ON public.sku_suppliers (sku_id)
  WHERE is_primary = true;

CREATE OR REPLACE FUNCTION public.set_sku_suppliers_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sku_suppliers_set_updated_at ON public.sku_suppliers;

CREATE TRIGGER sku_suppliers_set_updated_at
BEFORE UPDATE ON public.sku_suppliers
FOR EACH ROW
EXECUTE FUNCTION public.set_sku_suppliers_updated_at();

ALTER TABLE public.sku_suppliers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sku_suppliers_select_ops_roles ON public.sku_suppliers;
DROP POLICY IF EXISTS sku_suppliers_insert_ops_admin ON public.sku_suppliers;
DROP POLICY IF EXISTS sku_suppliers_update_ops_admin ON public.sku_suppliers;
DROP POLICY IF EXISTS sku_suppliers_delete_super_admin ON public.sku_suppliers;

CREATE POLICY sku_suppliers_select_ops_roles
ON public.sku_suppliers
FOR SELECT
TO authenticated
USING (
  public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager', 'store_keeper']
  )
);

CREATE POLICY sku_suppliers_insert_ops_admin
ON public.sku_suppliers
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager']
  )
);

CREATE POLICY sku_suppliers_update_ops_admin
ON public.sku_suppliers
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

CREATE POLICY sku_suppliers_delete_super_admin
ON public.sku_suppliers
FOR DELETE
TO authenticated
USING (
  public.current_user_has_any_role(ARRAY['super_admin'])
);

COMMIT;
