-- Migration: Add RBAC policies for inventory_stock table
-- Allows super_admin and operations_manager to insert/update/select, only super_admin to delete

-- Drop policies if they exist (for idempotency)
DROP POLICY IF EXISTS inventory_stock_select_ops_roles ON public.inventory_stock;
DROP POLICY IF EXISTS inventory_stock_insert_ops_roles ON public.inventory_stock;
DROP POLICY IF EXISTS inventory_stock_update_ops_roles ON public.inventory_stock;
DROP POLICY IF EXISTS inventory_stock_delete_super_admin ON public.inventory_stock;

-- Allow SELECT for super_admin and operations_manager
CREATE POLICY inventory_stock_select_ops_roles
  ON public.inventory_stock
  FOR SELECT
  TO authenticated
  USING (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])
  );

-- Allow INSERT for super_admin and operations_manager
CREATE POLICY inventory_stock_insert_ops_roles
  ON public.inventory_stock
  FOR INSERT
  TO authenticated
  WITH CHECK (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])
  );

-- Allow UPDATE for super_admin and operations_manager
CREATE POLICY inventory_stock_update_ops_roles
  ON public.inventory_stock
  FOR UPDATE
  TO authenticated
  USING (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])
  )
  WITH CHECK (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])
  );

-- Allow DELETE for super_admin only
CREATE POLICY inventory_stock_delete_super_admin
  ON public.inventory_stock
  FOR DELETE
  TO authenticated
  USING (
    current_user_has_any_role(ARRAY['super_admin'::text])
  );
