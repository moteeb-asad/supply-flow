-- Let store keepers read stock levels.
--
-- Before: only super_admin and operations_manager could SELECT
-- inventory_stock (migration 022). Store keepers opening the inventory list
-- got no stock rows, so every SKU showed 0 units.
--
-- Read-only: insert, update and delete policies are unchanged, so stock still
-- changes only through receiving and the ops roles.
--
-- The role check is wrapped in (select ...) so Postgres evaluates it once per
-- query instead of once per row.

DROP POLICY IF EXISTS inventory_stock_select_ops_roles ON public.inventory_stock;
DROP POLICY IF EXISTS inventory_stock_select_inventory_roles ON public.inventory_stock;

CREATE POLICY inventory_stock_select_inventory_roles
  ON public.inventory_stock
  FOR SELECT
  TO authenticated
  USING (
    (SELECT public.current_user_has_any_role(
      ARRAY['super_admin'::text, 'operations_manager'::text, 'store_keeper'::text]
    ))
  );
