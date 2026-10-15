-- Dashboard "Supplier Performance Trends": weekly on-time delivery rate for the
-- most active suppliers.
--
-- A receipt is on time when it arrived (in the user's timezone) on or before
-- its PO's expected_delivery_date. Receipts on POs without an expected date
-- are excluded.
--
-- Scales with table size: only receipts inside the window are read (via the
-- sku_receivings_receipt_datetime_idx index), aggregated here, and returned as
-- a small fixed grid: top N suppliers x weeks (max 5 x 26 rows), so the
-- browser receives the same tiny payload no matter how much history exists.
-- Weeks without deliveries come back with deliveries = 0 (drawn as gaps).
--
-- SECURITY INVOKER: runs with the caller's RLS.

CREATE OR REPLACE FUNCTION public.get_supplier_performance_trends(
  p_timezone text DEFAULT 'UTC',
  p_weeks int DEFAULT 8,
  p_suppliers int DEFAULT 3
)
RETURNS TABLE (
  supplier_id uuid,
  supplier_name text,
  week_start date,
  deliveries int,
  on_time_deliveries int
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_timezone text := coalesce(p_timezone, 'UTC');
  v_weeks int := least(greatest(coalesce(p_weeks, 8), 1), 26);
  v_suppliers int := least(greatest(coalesce(p_suppliers, 3), 1), 5);
  v_today date;
  v_current_week date;
  v_window_start date;
BEGIN
  BEGIN
    v_today := (now() AT TIME ZONE v_timezone)::date;
  EXCEPTION WHEN invalid_parameter_value THEN
    v_timezone := 'UTC';
    v_today := (now() AT TIME ZONE 'UTC')::date;
  END;

  v_current_week := date_trunc('week', v_today)::date;
  v_window_start := v_current_week - (v_weeks - 1) * 7;

  RETURN QUERY
  WITH receipts AS (
    SELECT
      po.supplier_id,
      (sr.receipt_datetime AT TIME ZONE v_timezone)::date AS receipt_date,
      po.expected_delivery_date
    FROM sku_receivings sr
    JOIN purchase_orders po ON po.id = sr.purchase_order_id
    WHERE sr.receipt_datetime >= (v_window_start::timestamp AT TIME ZONE v_timezone)
      AND po.expected_delivery_date IS NOT NULL
  ),
  top_suppliers AS (
    SELECT r.supplier_id, count(*) AS receipt_count
    FROM receipts r
    GROUP BY r.supplier_id
    ORDER BY receipt_count DESC, r.supplier_id
    LIMIT v_suppliers
  ),
  weeks AS (
    SELECT generate_series(v_window_start, v_current_week, interval '7 days')::date AS week_start
  ),
  weekly AS (
    SELECT
      r.supplier_id,
      date_trunc('week', r.receipt_date)::date AS week_start,
      count(*)::int AS deliveries,
      count(*) FILTER (WHERE r.receipt_date <= r.expected_delivery_date)::int AS on_time
    FROM receipts r
    WHERE r.supplier_id IN (SELECT ts.supplier_id FROM top_suppliers ts)
    GROUP BY r.supplier_id, date_trunc('week', r.receipt_date)
  )
  SELECT
    ts.supplier_id,
    s.name,
    w.week_start,
    coalesce(wk.deliveries, 0),
    coalesce(wk.on_time, 0)
  FROM top_suppliers ts
  CROSS JOIN weeks w
  LEFT JOIN suppliers s ON s.id = ts.supplier_id
  LEFT JOIN weekly wk
    ON wk.supplier_id = ts.supplier_id AND wk.week_start = w.week_start
  ORDER BY ts.receipt_count DESC, ts.supplier_id, w.week_start;
END;
$$;

REVOKE ALL ON FUNCTION public.get_supplier_performance_trends(text, int, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_supplier_performance_trends(text, int, int) TO authenticated;
