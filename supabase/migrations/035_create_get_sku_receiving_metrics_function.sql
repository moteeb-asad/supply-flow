-- KPI cards for the SKU Receiving screen, computed in one round trip.
--
-- Time windows are passed in by the caller (start of the user's local day and
-- month) because the database runs in UTC and would otherwise cut days at the
-- wrong hour. Windows use receipt_datetime (when goods arrived), not created_at.
--
-- SECURITY INVOKER: runs with the caller's RLS, which already grants read
-- access on all tables below to super_admin, operations_manager, store_keeper.

CREATE OR REPLACE FUNCTION public.get_sku_receiving_metrics(
  p_day_start timestamptz,
  p_month_start timestamptz
)
RETURNS TABLE (
  awaiting_receipt_count int,
  received_today_qty numeric,
  variance_cases_mtd int,
  received_value_mtd numeric
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    -- POs still expecting goods (same statuses as the receiving PO lookup).
    (
      SELECT count(*)::int
      FROM purchase_orders
      WHERE status IN ('pending', 'partially_received', 'overdue')
    ),
    -- Accepted units received since the start of the user's day.
    (
      SELECT coalesce(sum(li.qty_received), 0)
      FROM sku_receiving_line_items li
      JOIN sku_receivings sr ON sr.id = li.sku_receiving_id
      WHERE sr.receipt_datetime >= p_day_start
    ),
    -- Receipts flagged for variance (rejects) this month.
    (
      SELECT count(*)::int
      FROM sku_receivings
      WHERE status = 'variance_flagged'
        AND receipt_datetime >= p_month_start
    ),
    -- Value of accepted goods this month at PO unit price (pre-tax).
    (
      SELECT coalesce(sum(li.qty_received * poi.unit_price), 0)
      FROM sku_receiving_line_items li
      JOIN sku_receivings sr ON sr.id = li.sku_receiving_id
      JOIN purchase_order_items poi ON poi.id = li.purchase_order_item_id
      WHERE sr.receipt_datetime >= p_month_start
    );
$$;

REVOKE ALL ON FUNCTION public.get_sku_receiving_metrics(timestamptz, timestamptz)
  FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_sku_receiving_metrics(timestamptz, timestamptz)
  TO authenticated;
