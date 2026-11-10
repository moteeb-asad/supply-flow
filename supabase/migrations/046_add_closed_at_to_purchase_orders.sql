-- When a purchase order was closed, so "completed this month" can be counted
-- by date instead of counting every closed PO ever.
--
-- A trigger keeps the column in step with status, so every way a PO closes is
-- covered without touching the app or other functions:
--   - confirm_sku_receiving sets status = 'closed' when the last line is received
--   - a user sets status = 'closed' by hand in the edit drawer
-- Moving a PO out of 'closed' clears the date again.

ALTER TABLE public.purchase_orders
  ADD COLUMN IF NOT EXISTS closed_at timestamptz;

COMMENT ON COLUMN public.purchase_orders.closed_at IS
  'When status last became closed. Set by trigger; null while the PO is not closed.';

-- BEFORE trigger: only changes the row being written, so it needs no extra
-- privileges and runs inside the caller's own insert or update.
CREATE OR REPLACE FUNCTION public.set_purchase_order_closed_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'closed' THEN
    -- Keep the first close time when a closed PO is saved again.
    IF TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'closed' THEN
      NEW.closed_at := now();
    END IF;
  ELSE
    NEW.closed_at := NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS purchase_orders_set_closed_at ON public.purchase_orders;

CREATE TRIGGER purchase_orders_set_closed_at
BEFORE INSERT OR UPDATE OF status ON public.purchase_orders
FOR EACH ROW
EXECUTE FUNCTION public.set_purchase_order_closed_at();

-- Backfill POs that are already closed: their latest receipt is when the last
-- goods arrived; POs closed by hand without a receipt fall back to updated_at.
-- The trigger only fires on status changes, so it leaves this UPDATE alone.
UPDATE public.purchase_orders po
SET closed_at = coalesce(
  (
    SELECT max(sr.receipt_datetime)
    FROM public.sku_receivings sr
    WHERE sr.purchase_order_id = po.id
  ),
  po.updated_at
)
WHERE po.status = 'closed'
  AND po.closed_at IS NULL;

-- "Completed this month" filters on this column.
CREATE INDEX IF NOT EXISTS purchase_orders_closed_at_idx
  ON public.purchase_orders (closed_at DESC)
  WHERE closed_at IS NOT NULL;
