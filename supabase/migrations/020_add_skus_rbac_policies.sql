-- Migration: Add RBAC policies for skus table
-- Allows super_admin and operations_manager to insert/update, only super_admin to delete


-- Drop policies if they exist (for idempotency)
DROP POLICY IF EXISTS skus_select_authenticated ON public.skus;
DROP POLICY IF EXISTS skus_insert_ops_admin ON public.skus;
DROP POLICY IF EXISTS skus_update_ops_admin ON public.skus;
DROP POLICY IF EXISTS skus_delete_super_admin ON public.skus;

-- Allow SELECT for all authenticated users
CREATE POLICY skus_select_authenticated
  ON public.skus
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow INSERT for super_admin and operations_manager
CREATE POLICY skus_insert_ops_admin
  ON public.skus
  FOR INSERT
  TO authenticated
  WITH CHECK (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])
  );

-- Allow UPDATE for super_admin and operations_manager
CREATE POLICY skus_update_ops_admin
  ON public.skus
  FOR UPDATE
  TO authenticated
  USING (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])
  )
  WITH CHECK (
    current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])
  );

-- Allow DELETE for super_admin only
CREATE POLICY skus_delete_super_admin
  ON public.skus
  FOR DELETE
  TO authenticated
  USING (
    current_user_has_any_role(ARRAY['super_admin'::text])
  );
