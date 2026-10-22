-- Categories write policies: use the shared role check instead of a
-- hard-coded role id.
--
-- Before (migration 017): insert, update and delete checked
-- profiles.primary_role_id = 1, which only means super_admin because of the
-- order rows were inserted into roles. On another database (fresh setup,
-- restore, branch) the ids can differ and the policy would silently grant the
-- wrong role.
--
-- Access is unchanged: super_admin only. Read stays open to all signed-in
-- users ("Allow all select" is not touched).
--
-- The role check is wrapped in (select ...) so Postgres evaluates it once per
-- query instead of once per row.

DROP POLICY IF EXISTS "Allow super_admin insert" ON public.categories;
DROP POLICY IF EXISTS "Allow super_admin update" ON public.categories;
DROP POLICY IF EXISTS "Allow super_admin delete" ON public.categories;

CREATE POLICY "Allow super_admin insert"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT public.current_user_has_any_role(ARRAY['super_admin'::text]))
  );

CREATE POLICY "Allow super_admin update"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT public.current_user_has_any_role(ARRAY['super_admin'::text]))
  )
  WITH CHECK (
    (SELECT public.current_user_has_any_role(ARRAY['super_admin'::text]))
  );

CREATE POLICY "Allow super_admin delete"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (
    (SELECT public.current_user_has_any_role(ARRAY['super_admin'::text]))
  );
