-- KPI cards for the main dashboard, computed in one round trip.
--
-- All aggregation happens here (indexed counts and sums), so the app only
-- receives a handful of numbers regardless of how large the tables grow.
--
-- p_timezone: the user's IANA timezone (e.g. 'Asia/Karachi') so "today" and
-- "this month" follow the user's calendar. Invalid or null values fall back
-- to UTC.
--
-- SECURITY INVOKER: runs with the caller's RLS. Roles without read access to
-- a table get zeros for its KPIs; the app hides those cards by permission.

CREATE OR REPLACE FUNCTION public.get_dashboard_metrics(
  p_timezone text DEFAULT 'UTC'
)
RETURNS TABLE (
  open_po_count int,
  draft_po_count int,
  pending_delivery_count int,
  urgent_delivery_count int,
  low_stock_count int,
  critical_stock_count int,
  spend_mtd numeric,
  spend_prev_period numeric
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_today date;
  v_month_start date;
  v_prev_month_start date;
  v_days_into_month int;
BEGIN
  BEGIN
    v_today := (now() AT TIME ZONE coalesce(p_timezone, 'UTC'))::date;
  EXCEPTION WHEN invalid_parameter_value THEN
    v_today := (now() AT TIME ZONE 'UTC')::date;
  END;

  v_month_start := date_trunc('month', v_today)::date;
  v_prev_month_start := (v_month_start - interval '1 month')::date;
  v_days_into_month := v_today - v_month_start;

  RETURN QUERY
  SELECT
    -- Open POs: everything not closed or cancelled (drafts still need approval).
    (SELECT count(*)::int FROM purchase_orders
      WHERE status IN ('draft', 'pending', 'partially_received', 'overdue')),
    (SELECT count(*)::int FROM purchase_orders
      WHERE status = 'draft'),

    -- Pending deliveries: POs still expecting goods; urgent = overdue or due
    -- within the next 2 days.
    (SELECT count(*)::int FROM purchase_orders
      WHERE status IN ('pending', 'partially_received', 'overdue')),
    (SELECT count(*)::int FROM purchase_orders
      WHERE status IN ('pending', 'partially_received', 'overdue')
        AND (status = 'overdue' OR expected_delivery_date <= v_today + 2)),

    -- Stock alerts from the computed stock_status column.
    (SELECT count(*)::int FROM inventory_stock
      WHERE stock_status IN ('low', 'critical')),
    (SELECT count(*)::int FROM inventory_stock
      WHERE stock_status = 'critical'),

    -- Spend: committed POs (not draft or cancelled) ordered this month so far,
    -- and the same number of days in the previous month for a fair comparison.
    (SELECT coalesce(sum(total_amount), 0) FROM purchase_orders
      WHERE status NOT IN ('draft', 'cancelled')
        AND order_date >= v_month_start
        AND order_date <= v_today),
    (SELECT coalesce(sum(total_amount), 0) FROM purchase_orders
      WHERE status NOT IN ('draft', 'cancelled')
        AND order_date >= v_prev_month_start
        AND order_date <= v_prev_month_start + v_days_into_month
        AND order_date < v_month_start);
END;
$$;

REVOKE ALL ON FUNCTION public.get_dashboard_metrics(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_dashboard_metrics(text) TO authenticated;
