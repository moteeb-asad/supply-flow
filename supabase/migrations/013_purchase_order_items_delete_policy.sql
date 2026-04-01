-- Migration: Add DELETE RLS policy for purchase_order_items table
-- Created: 2026-04-01
-- Purpose: Enable deletion of line items when editing purchase orders

-- Add DELETE policy for operations_manager and super_admin roles
-- Uses existing current_user_has_any_role() function to avoid infinite recursion
CREATE POLICY purchase_order_items_delete_ops_admin
ON public.purchase_order_items
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.purchase_orders po
    WHERE po.id = purchase_order_id
      AND po.created_by = auth.uid()
  )
  AND public.current_user_has_any_role(ARRAY['super_admin', 'operations_manager'])
);
