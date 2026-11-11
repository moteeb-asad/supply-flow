-- Performance: run RLS role and user checks once per query, not once per row.
--
-- 20 of the 26 policies that check roles called current_user_has_any_role(...)
-- (and auth.uid()) directly, so Postgres re-ran the check for every row it
-- scanned. With 100k purchase orders (seeded local database) that pushed the
-- dashboard metrics, the SKU receiving list and the inventory screen past the
-- 8 s statement_timeout of the authenticated role.
--
-- Wrapping each call in (SELECT ...) lets Postgres evaluate it once per
-- statement (an InitPlan) and reuse the result. Same inputs, same result, so
-- who can see or change what is unchanged; only how often the check runs.
-- https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
--
-- ALTER POLICY keeps each policy's command (SELECT, INSERT, ...) and roles and
-- only replaces USING / WITH CHECK. Generated from the live production policies
-- on 2026-11-11 (pg_policies fingerprint 81b900c833a6e1de4143b65b8e0ed192).
-- Policies already wrapped (categories, suppliers, inventory_stock select) are
-- left as they are. Decision record: docs/decisions/0007.

BEGIN;

ALTER POLICY "inventory_stock_delete_super_admin" ON public."inventory_stock"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text])));

ALTER POLICY "inventory_stock_insert_ops_roles" ON public."inventory_stock"
  WITH CHECK ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])));

ALTER POLICY "inventory_stock_update_ops_roles" ON public."inventory_stock"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])))
  WITH CHECK ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])));

ALTER POLICY "Users can read own profile" ON public."profiles"
  USING ((id = (SELECT auth.uid())));

ALTER POLICY "purchase_order_items_delete_ops_admin" ON public."purchase_order_items"
  USING (((EXISTS ( SELECT 1
   FROM purchase_orders po
  WHERE ((po.id = purchase_order_items.purchase_order_id) AND (po.created_by = (SELECT auth.uid()))))) AND (SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text]))));

ALTER POLICY "purchase_order_items_insert_ops_admin" ON public."purchase_order_items"
  WITH CHECK (((EXISTS ( SELECT 1
   FROM purchase_orders po
  WHERE ((po.id = purchase_order_items.purchase_order_id) AND (po.created_by = (SELECT auth.uid()))))) AND (SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text]))));

ALTER POLICY "purchase_order_items_select_by_role" ON public."purchase_order_items"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text, 'store_keeper'::text])));

ALTER POLICY "purchase_order_items_update_ops_admin" ON public."purchase_order_items"
  USING (((EXISTS ( SELECT 1
   FROM purchase_orders po
  WHERE ((po.id = purchase_order_items.purchase_order_id) AND (po.created_by = (SELECT auth.uid()))))) AND (SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text]))))
  WITH CHECK (((EXISTS ( SELECT 1
   FROM purchase_orders po
  WHERE ((po.id = purchase_order_items.purchase_order_id) AND (po.created_by = (SELECT auth.uid()))))) AND (SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text]))));

ALTER POLICY "purchase_orders_insert_ops_admin" ON public."purchase_orders"
  WITH CHECK (((created_by = (SELECT auth.uid())) AND (SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text]))));

ALTER POLICY "purchase_orders_select_by_role" ON public."purchase_orders"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text, 'store_keeper'::text])));

ALTER POLICY "purchase_orders_update_ops_admin" ON public."purchase_orders"
  USING ((((created_by = (SELECT auth.uid())) AND (SELECT current_user_has_any_role(ARRAY['operations_manager'::text, 'super_admin'::text]))) OR (SELECT current_user_has_any_role(ARRAY['super_admin'::text]))))
  WITH CHECK ((((created_by = (SELECT auth.uid())) AND (SELECT current_user_has_any_role(ARRAY['operations_manager'::text, 'super_admin'::text]))) OR (SELECT current_user_has_any_role(ARRAY['super_admin'::text]))));

ALTER POLICY "sku_receiving_line_items_delete_super_admin" ON public."sku_receiving_line_items"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text])));

ALTER POLICY "sku_receiving_line_items_insert_ops_roles" ON public."sku_receiving_line_items"
  WITH CHECK ((EXISTS ( SELECT 1
   FROM sku_receivings sr
  WHERE ((sr.id = sku_receiving_line_items.sku_receiving_id) AND ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])) OR ((SELECT current_user_has_any_role(ARRAY['store_keeper'::text])) AND (sr.received_by = (SELECT auth.uid())) AND (sr.status = ANY (ARRAY['pending'::sku_receiving_status, 'in_progress'::sku_receiving_status, 'partially_received'::sku_receiving_status]))))))));

ALTER POLICY "sku_receiving_line_items_select_ops_roles" ON public."sku_receiving_line_items"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text, 'store_keeper'::text])));

ALTER POLICY "sku_receiving_line_items_update_ops_roles" ON public."sku_receiving_line_items"
  USING ((EXISTS ( SELECT 1
   FROM sku_receivings sr
  WHERE ((sr.id = sku_receiving_line_items.sku_receiving_id) AND ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])) OR ((SELECT current_user_has_any_role(ARRAY['store_keeper'::text])) AND (sr.received_by = (SELECT auth.uid())) AND (sr.status = ANY (ARRAY['pending'::sku_receiving_status, 'in_progress'::sku_receiving_status, 'partially_received'::sku_receiving_status]))))))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM sku_receivings sr
  WHERE ((sr.id = sku_receiving_line_items.sku_receiving_id) AND ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])) OR ((SELECT current_user_has_any_role(ARRAY['store_keeper'::text])) AND (sr.received_by = (SELECT auth.uid())) AND (sr.status = ANY (ARRAY['pending'::sku_receiving_status, 'in_progress'::sku_receiving_status, 'partially_received'::sku_receiving_status]))))))));

ALTER POLICY "sku_receivings_delete_super_admin" ON public."sku_receivings"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text])));

ALTER POLICY "sku_receivings_insert_ops_roles" ON public."sku_receivings"
  WITH CHECK (((received_by = (SELECT auth.uid())) AND (SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text, 'store_keeper'::text]))));

ALTER POLICY "sku_receivings_select_ops_roles" ON public."sku_receivings"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text, 'store_keeper'::text])));

ALTER POLICY "sku_receivings_update_ops_roles" ON public."sku_receivings"
  USING (((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])) OR ((SELECT current_user_has_any_role(ARRAY['store_keeper'::text])) AND (received_by = (SELECT auth.uid())) AND (status = ANY (ARRAY['pending'::sku_receiving_status, 'in_progress'::sku_receiving_status, 'partially_received'::sku_receiving_status])))))
  WITH CHECK (((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])) OR ((SELECT current_user_has_any_role(ARRAY['store_keeper'::text])) AND (received_by = (SELECT auth.uid())) AND (status = ANY (ARRAY['pending'::sku_receiving_status, 'in_progress'::sku_receiving_status, 'partially_received'::sku_receiving_status])))));

ALTER POLICY "sku_suppliers_delete_super_admin" ON public."sku_suppliers"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text])));

ALTER POLICY "sku_suppliers_insert_ops_admin" ON public."sku_suppliers"
  WITH CHECK ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])));

ALTER POLICY "sku_suppliers_select_ops_roles" ON public."sku_suppliers"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text, 'store_keeper'::text])));

ALTER POLICY "sku_suppliers_update_ops_admin" ON public."sku_suppliers"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])))
  WITH CHECK ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])));

ALTER POLICY "skus_delete_super_admin" ON public."skus"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text])));

ALTER POLICY "skus_insert_ops_admin" ON public."skus"
  WITH CHECK ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])));

ALTER POLICY "skus_update_ops_admin" ON public."skus"
  USING ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])))
  WITH CHECK ((SELECT current_user_has_any_role(ARRAY['super_admin'::text, 'operations_manager'::text])));

ALTER POLICY "Users can read own roles" ON public."user_roles"
  USING ((user_id = (SELECT auth.uid())));

COMMIT;
