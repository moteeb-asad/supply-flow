-- Metric cards for the purchase orders list, computed in one round trip.
-- Replaces the browser counting over up to 1000 downloaded rows.
--
-- Whole-business figures: no search, filter or status-tab parameters, so the
-- cards never change with the table (docs/decisions/0003).
--
-- p_timezone: the user's IANA timezone (e.g. 'Asia/Karachi') so "today" and
-- "this month" follow the user's calendar. Invalid or null values fall back
-- to UTC.
--
-- SECURITY INVOKER: runs with the caller's RLS, like get_dashboard_metrics.

CREATE OR REPLACE FUNCTION public.get_purchase_order_metrics(
  p_timezone text DEFAULT 'UTC'
)
RETURNS TABLE (
  open_commitment numeric,
  overdue_count int,
  completed_this_month int
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_timezone text := coalesce(p_timezone, 'UTC');
  v_today date;
  v_month_start timestamptz;
BEGIN
  BEGIN
    v_today := (now() AT TIME ZONE v_timezone)::date;
  EXCEPTION WHEN invalid_parameter_value THEN
    v_timezone := 'UTC';
    v_today := (now() AT TIME ZONE v_timezone)::date;
  END;

  -- Midnight on the 1st of this month in the user's timezone, as an instant.
  v_month_start := date_trunc('month', v_today)::timestamp AT TIME ZONE v_timezone;

  RETURN QUERY
  SELECT
    -- Money promised to suppliers: POs sent and still waiting for goods.
    -- Drafts are not sent yet; closed and cancelled are done.
    coalesce(sum(total_amount) FILTER (
      WHERE status IN ('pending', 'partially_received', 'overdue')
    ), 0),

    -- Still waiting and past the expected date. Counted by date as well as
    -- status, so the card is right even before the hourly overdue sweep
    -- (migration 047) updates the status.
    (count(*) FILTER (
      WHERE status = 'overdue'
         OR (status IN ('pending', 'partially_received')
             AND expected_delivery_date < v_today)
    ))::int,

    -- Closed since the start of this month (closed_at from migration 046).
    (count(*) FILTER (
      WHERE status = 'closed' AND closed_at >= v_month_start
    ))::int
  FROM purchase_orders;
END;
$$;

REVOKE ALL ON FUNCTION public.get_purchase_order_metrics(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_purchase_order_metrics(text) TO authenticated;
