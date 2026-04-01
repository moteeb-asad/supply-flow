-- Purchase Orders + SKUs RLS policies
-- NOTE:
-- auth.uid() is the authenticated user's id from auth.users.
-- In this project, public.profiles.id mirrors auth.users.id (1:1),
-- so checking auth.uid() also checks against profiles.id values.

-- Enable RLS on PO-related tables
ALTER TABLE public.skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for idempotent migration reruns
DROP POLICY IF EXISTS "skus_select_authenticated" ON public.skus;
DROP POLICY IF EXISTS "purchase_orders_select_by_role" ON public.purchase_orders;
DROP POLICY IF EXISTS "purchase_orders_insert_ops_admin" ON public.purchase_orders;
DROP POLICY IF EXISTS "purchase_orders_update_ops_admin" ON public.purchase_orders;
DROP POLICY IF EXISTS "purchase_order_items_select_by_role" ON public.purchase_order_items;
DROP POLICY IF EXISTS "purchase_order_items_insert_ops_admin" ON public.purchase_order_items;
DROP POLICY IF EXISTS "purchase_order_items_update_ops_admin" ON public.purchase_order_items;

-- SKU catalog read policy (needed for Add Item searchable dropdown)
CREATE POLICY "skus_select_authenticated"
ON public.skus
FOR SELECT
TO authenticated
USING (true);

-- Helper predicate inline pattern for role checks:
-- role.name IN ('super_admin', 'operations_manager', 'store_keeper') for read
-- role.name IN ('super_admin', 'operations_manager') for create/update

-- PURCHASE ORDERS: read allowed to operational roles
CREATE POLICY "purchase_orders_select_by_role"
ON public.purchase_orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name IN ('super_admin', 'operations_manager', 'store_keeper')
  )
);

-- PURCHASE ORDERS: only operations_manager/super_admin can create,
-- and created_by must be the current user's profile id
CREATE POLICY "purchase_orders_insert_ops_admin"
ON public.purchase_orders
FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name IN ('super_admin', 'operations_manager')
  )
);

-- PURCHASE ORDERS: only creator (or super_admin) can update
CREATE POLICY "purchase_orders_update_ops_admin"
ON public.purchase_orders
FOR UPDATE
TO authenticated
USING (
  (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('operations_manager', 'super_admin')
    )
  )
  OR EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'super_admin'
  )
)
WITH CHECK (
  (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('operations_manager', 'super_admin')
    )
  )
  OR EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'super_admin'
  )
);

-- PURCHASE ORDER ITEMS: read follows operational roles
CREATE POLICY "purchase_order_items_select_by_role"
ON public.purchase_order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name IN ('super_admin', 'operations_manager', 'store_keeper')
  )
);

-- PURCHASE ORDER ITEMS: creator of parent PO (ops/admin) can insert
CREATE POLICY "purchase_order_items_insert_ops_admin"
ON public.purchase_order_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.purchase_orders po
    JOIN public.user_roles ur ON ur.user_id = auth.uid()
    JOIN public.roles r ON r.id = ur.role_id
    WHERE po.id = purchase_order_id
      AND po.created_by = auth.uid()
      AND r.name IN ('super_admin', 'operations_manager')
  )
);

-- PURCHASE ORDER ITEMS: creator of parent PO (ops/admin) can update
CREATE POLICY "purchase_order_items_update_ops_admin"
ON public.purchase_order_items
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.purchase_orders po
    JOIN public.user_roles ur ON ur.user_id = auth.uid()
    JOIN public.roles r ON r.id = ur.role_id
    WHERE po.id = purchase_order_id
      AND po.created_by = auth.uid()
      AND r.name IN ('super_admin', 'operations_manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.purchase_orders po
    JOIN public.user_roles ur ON ur.user_id = auth.uid()
    JOIN public.roles r ON r.id = ur.role_id
    WHERE po.id = purchase_order_id
      AND po.created_by = auth.uid()
      AND r.name IN ('super_admin', 'operations_manager')
  )
);
