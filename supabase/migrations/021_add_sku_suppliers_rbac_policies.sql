-- Migration: Add RBAC policies for sku_suppliers table
-- Allows super_admin and operations_manager to insert/update, only super_admin to delete
-- All roles (including store_keeper) can SELECT

-- Drop policies if they exist (for idempotency)
DROP POLICY IF EXISTS sku_suppliers_select_ops_roles ON public.sku_suppliers;
DROP POLICY IF EXISTS sku_suppliers_insert_ops_admin ON public.sku_suppliers;
DROP POLICY IF EXISTS sku_suppliers_update_ops_admin ON public.sku_suppliers;
DROP POLICY IF EXISTS sku_suppliers_delete_super_admin ON public.sku_suppliers;

-- Allow SELECT for all roles (super_admin, operations_manager, store_keeper)
CREATE POLICY sku_suppliers_select_ops_roles
  ON public.sku_suppliers
  FOR SELECT
  TO authenticated
  USING (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text, 'store_keeper'::text])
  );

-- Allow INSERT for super_admin and operations_manager
CREATE POLICY sku_suppliers_insert_ops_admin
  ON public.sku_suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])
  );

-- Allow UPDATE for super_admin and operations_manager
CREATE POLICY sku_suppliers_update_ops_admin
  ON public.sku_suppliers
  FOR UPDATE
  TO authenticated
  USING (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])
  )
  WITH CHECK (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])
  );

-- Allow DELETE for super_admin only
CREATE POLICY sku_suppliers_delete_super_admin
  ON public.sku_suppliers
  FOR DELETE
  TO authenticated
  USING (
    current_user_has_any_role(ARRAY['super_admin'::text])
  );
