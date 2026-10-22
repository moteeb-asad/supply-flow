-- suppliers_insert: allow only roles with suppliers:manage.
--
-- Before (migration 007): WITH CHECK (auth.uid() = created_by) only, so any
-- signed-in user, including store keepers, could create suppliers.
--
-- After: super_admin and operations_manager (the suppliers:manage roles in
-- src/features/auth/constants/rbac.ts), and created_by must still be the
-- caller so nobody can insert a supplier on someone else's behalf.
--
-- The role check is wrapped in (select ...) so Postgres evaluates it once per
-- query instead of once per row.

DROP POLICY IF EXISTS "suppliers_insert" ON public.suppliers;

CREATE POLICY "suppliers_insert"
  ON public.suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = created_by
    AND (SELECT public.current_user_has_any_role(
      ARRAY['super_admin'::text, 'operations_manager'::text]
    ))
  );
