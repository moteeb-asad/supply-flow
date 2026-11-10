-- Purchase orders become 'overdue' on their own once the expected delivery
-- date has passed, instead of relying on someone to set it by hand.
--
-- Two parts, because a trigger alone cannot notice time passing:
--   1. A trigger re-checks a PO whenever its status or expected delivery date
--      is written (create, edit drawer, receiving). Moving the date into the
--      future also takes an overdue PO back to pending / partially received.
--   2. A function, mark_overdue_purchase_orders(), sweeps POs whose date has
--      passed since they were last written. pg_cron runs it every hour.
--
-- Rules:
--   - Only POs still waiting for goods can be overdue: pending,
--     partially_received, overdue. Drafts (not sent) and closed or cancelled
--     POs are never touched.
--   - Overdue wins over partially received: a late PO stays overdue after a
--     partial delivery. Receiving the rest still closes it.
--   - "Today" is the UTC date. With hourly runs a PO turns overdue within an
--     hour of UTC midnight after its expected date.
--   - No expected delivery date means it can never be overdue.
--
-- Portability: the sweep is a plain SQL function. If a Postgres host has no
-- pg_cron, the scheduling step below is skipped with a notice, and any other
-- scheduler (e.g. a Vercel Cron calling an API route) can call the function.

-- 1. Trigger ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_purchase_order_overdue_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_is_late boolean :=
    NEW.expected_delivery_date IS NOT NULL
    AND NEW.expected_delivery_date < v_today;
  v_has_receipts boolean;
BEGIN
  IF NEW.status IN ('pending', 'partially_received') AND v_is_late THEN
    NEW.status := 'overdue';

  ELSIF NEW.status = 'overdue' AND NOT v_is_late THEN
    -- Date moved into the future (or cleared): back to the waiting state that
    -- matches what has been received so far. A new PO has no lines yet.
    IF TG_OP = 'UPDATE' THEN
      SELECT EXISTS (
        SELECT 1 FROM purchase_order_items
        WHERE purchase_order_id = NEW.id AND received_qty > 0
      ) INTO v_has_receipts;
    ELSE
      v_has_receipts := false;
    END IF;

    NEW.status := CASE
      WHEN v_has_receipts THEN 'partially_received'
      ELSE 'pending'
    END::purchase_order_status;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS purchase_orders_set_overdue_status ON public.purchase_orders;

-- Fires after purchase_orders_set_closed_at (BEFORE triggers run in name
-- order); this one never sets 'closed', so closed_at stays correct.
CREATE TRIGGER purchase_orders_set_overdue_status
BEFORE INSERT OR UPDATE OF status, expected_delivery_date
ON public.purchase_orders
FOR EACH ROW
EXECUTE FUNCTION public.set_purchase_order_overdue_status();

-- 2. Hourly sweep ----------------------------------------------------------

-- Returns how many POs it marked, for logs. Safe to run any number of times.
CREATE OR REPLACE FUNCTION public.mark_overdue_purchase_orders()
RETURNS int
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  UPDATE purchase_orders
  SET status = 'overdue'
  WHERE status IN ('pending', 'partially_received')
    AND expected_delivery_date < (now() AT TIME ZONE 'UTC')::date;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- Scheduler only: app users never call this directly.
REVOKE ALL ON FUNCTION public.mark_overdue_purchase_orders()
  FROM PUBLIC, anon, authenticated;

-- 3. Schedule with pg_cron, when the host has it ---------------------------

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'pg_cron') THEN
    CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

    -- Same job name replaces the existing schedule, so re-running is safe.
    -- Minute 5 of every hour.
    PERFORM cron.schedule(
      'mark-overdue-purchase-orders',
      '5 * * * *',
      'SELECT public.mark_overdue_purchase_orders();'
    );
  ELSE
    RAISE NOTICE
      'pg_cron is not available: schedule public.mark_overdue_purchase_orders() with another scheduler.';
  END IF;
END;
$$;

-- 4. Catch up existing POs that are already late ---------------------------

SELECT public.mark_overdue_purchase_orders();
