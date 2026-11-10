-- Metric cards for the suppliers list, computed in one round trip.
-- Replaces the hard-coded placeholders in SupplierMetrics.tsx.
--
-- Whole-business figures: no search, category or filter parameters
-- (docs/decisions/0003). Decision record: docs/decisions/0005.
--
-- p_timezone: the user's IANA timezone so "this year" and "on time" follow
-- the user's calendar. Invalid or null values fall back to UTC.
--
-- SECURITY INVOKER: runs with the caller's RLS, like the other metric
-- functions.

CREATE OR REPLACE FUNCTION public.get_supplier_overview_metrics(
  p_timezone text DEFAULT 'UTC'
)
RETURNS TABLE (
  active_supplier_count int,
  deliveries_this_year int,
  on_time_deliveries_this_year int,
  on_time_rate numeric,
  spend_this_year numeric
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_timezone text := coalesce(p_timezone, 'UTC');
  v_today date;
  v_year_start date;
  v_deliveries int;
  v_on_time int;
BEGIN
  BEGIN
    v_today := (now() AT TIME ZONE v_timezone)::date;
  EXCEPTION WHEN invalid_parameter_value THEN
    v_timezone := 'UTC';
    v_today := (now() AT TIME ZONE v_timezone)::date;
  END;

  v_year_start := date_trunc('year', v_today)::date;

  -- Performance = on-time delivery rate, the same rule as the dashboard's
  -- supplier trend chart (migration 041): a receipt is on time when it
  -- arrived, in the user's timezone, on or before its PO's expected date.
  -- Receipts on POs without an expected date are left out.
  SELECT
    count(*)::int,
    (count(*) FILTER (
      WHERE (sr.receipt_datetime AT TIME ZONE v_timezone)::date
            <= po.expected_delivery_date
    ))::int
  INTO v_deliveries, v_on_time
  FROM sku_receivings sr
  JOIN purchase_orders po ON po.id = sr.purchase_order_id
  WHERE po.expected_delivery_date IS NOT NULL
    AND sr.receipt_datetime >= (v_year_start::timestamp AT TIME ZONE v_timezone);

  RETURN QUERY
  SELECT
    (SELECT count(*)::int FROM suppliers WHERE status = 'active'),
    v_deliveries,
    v_on_time,
    -- Percentage with one decimal; null when nothing was delivered this year,
    -- so the card shows "—" instead of a misleading 0%.
    CASE
      WHEN v_deliveries = 0 THEN NULL
      ELSE round(v_on_time * 100.0 / v_deliveries, 1)
    END,
    -- Committed spend: POs sent this year (drafts and cancelled left out),
    -- the same rule as the dashboard's spend KPI (migration 039).
    (SELECT coalesce(sum(total_amount), 0) FROM purchase_orders
      WHERE status NOT IN ('draft', 'cancelled')
        AND order_date >= v_year_start
        AND order_date <= v_today);
END;
$$;

REVOKE ALL ON FUNCTION public.get_supplier_overview_metrics(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_supplier_overview_metrics(text) TO authenticated;
