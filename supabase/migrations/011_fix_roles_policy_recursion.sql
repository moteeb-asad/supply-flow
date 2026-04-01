-- Fix infinite recursion from RLS role checks
-- Problem: PO policies joined public.roles/public.user_roles directly inside policy clauses.
-- Solution: move role check into SECURITY DEFINER helper functions and reference those in policies.

-- 1) Non-recursive role helper
CREATE OR REPLACE FUNCTION public.current_user_has_any_role(role_names text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name = ANY(role_names)
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_has_any_role(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_has_any_role(text[]) TO authenticated;

-- 2) Replace PO policies that referenced roles/user_roles directly
DROP POLICY IF EXISTS "purchase_orders_select_by_role" ON public.purchase_orders;
DROP POLICY IF EXISTS "purchase_orders_insert_ops_admin" ON public.purchase_orders;
DROP POLICY IF EXISTS "purchase_orders_update_ops_admin" ON public.purchase_orders;

DROP POLICY IF EXISTS "purchase_order_items_select_by_role" ON public.purchase_order_items;
DROP POLICY IF EXISTS "purchase_order_items_insert_ops_admin" ON public.purchase_order_items;
DROP POLICY IF EXISTS "purchase_order_items_update_ops_admin" ON public.purchase_order_items;

-- Purchase orders: read for operational roles
CREATE POLICY "purchase_orders_select_by_role"
ON public.purchase_orders
FOR SELECT
TO authenticated
USING (
  public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager', 'store_keeper']
  )
);

-- Purchase orders: create only ops/admin and self as creator
CREATE POLICY "purchase_orders_insert_ops_admin"
ON public.purchase_orders
FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid()
  AND public.current_user_has_any_role(ARRAY['super_admin', 'operations_manager'])
);

-- Purchase orders: update by creator (ops/admin) or super admin
CREATE POLICY "purchase_orders_update_ops_admin"
ON public.purchase_orders
FOR UPDATE
TO authenticated
USING (
  (
    created_by = auth.uid()
    AND public.current_user_has_any_role(ARRAY['operations_manager', 'super_admin'])
  )
  OR public.current_user_has_any_role(ARRAY['super_admin'])
)
WITH CHECK (
  (
    created_by = auth.uid()
    AND public.current_user_has_any_role(ARRAY['operations_manager', 'super_admin'])
  )
  OR public.current_user_has_any_role(ARRAY['super_admin'])
);

-- PO items: read for operational roles
CREATE POLICY "purchase_order_items_select_by_role"
ON public.purchase_order_items
FOR SELECT
TO authenticated
USING (
  public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager', 'store_keeper']
  )
);

-- PO items: insert only for PO creator and ops/admin role
CREATE POLICY "purchase_order_items_insert_ops_admin"
ON public.purchase_order_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.purchase_orders po
    WHERE po.id = purchase_order_id
      AND po.created_by = auth.uid()
  )
  AND public.current_user_has_any_role(ARRAY['super_admin', 'operations_manager'])
);

-- PO items: update only for PO creator and ops/admin role
CREATE POLICY "purchase_order_items_update_ops_admin"
ON public.purchase_order_items
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.purchase_orders po
    WHERE po.id = purchase_order_id
      AND po.created_by = auth.uid()
  )
  AND public.current_user_has_any_role(ARRAY['super_admin', 'operations_manager'])
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.purchase_orders po
    WHERE po.id = purchase_order_id
      AND po.created_by = auth.uid()
  )
  AND public.current_user_has_any_role(ARRAY['super_admin', 'operations_manager'])
);
