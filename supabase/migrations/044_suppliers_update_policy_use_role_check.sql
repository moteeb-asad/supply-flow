-- suppliers_update: allow only roles with suppliers:manage.
--
-- Before: migration 007 created this policy as "creator only"; it was later
-- changed by hand on the live database (no migration) to:
--   auth.uid() = created_by
--   OR profiles.primary_role_id = ANY (ARRAY[1, 2])
-- Problems: hard-coded role ids (only correct by insert order), and any user
-- who created a supplier could edit it whatever their role.
--
-- After: super_admin and operations_manager (the suppliers:manage roles in
-- src/features/auth/constants/rbac.ts). Store keepers cannot edit suppliers.
--
-- The role check is wrapped in (select ...) so Postgres evaluates it once per
-- query instead of once per row.

DROP POLICY IF EXISTS "suppliers_update" ON public.suppliers;

CREATE POLICY "suppliers_update"
  ON public.suppliers
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT public.current_user_has_any_role(
      ARRAY['super_admin'::text, 'operations_manager'::text]
    ))
  )
  WITH CHECK (
    (SELECT public.current_user_has_any_role(
      ARRAY['super_admin'::text, 'operations_manager'::text]
    ))
  );
