-- Record what each delivery was expected to bring, so variance compares a
-- receipt against the qty still outstanding at that moment instead of the full
-- PO line ordered_qty (which made follow-up deliveries look short).
--
--   1. add sku_receiving_line_items.qty_expected
--   2. backfill existing rows from receipt history
--   3. confirm_sku_receiving() now stores qty_expected on every new line
--   4. sku_receivings_list exposes qty_expected (appended column)

-- 1. Column (nullable until backfilled) ------------------------------------

ALTER TABLE public.sku_receiving_line_items
  ADD COLUMN IF NOT EXISTS qty_expected numeric(12,2)
  CHECK (qty_expected >= 0);

-- 2. Backfill ---------------------------------------------------------------
-- Outstanding before a receipt = ordered_qty - (received_qty now - qty received
-- by this receipt and every later one). Receipts are ordered by created_at
-- (save order), which is the order confirm_sku_receiving() applied them in.
-- Uses the current ordered_qty, so a PO edited after receiving uses its new qty.

WITH line_history AS (
  SELECT
    li.id,
    poi.ordered_qty,
    poi.received_qty,
    sum(li.qty_received) OVER (
      PARTITION BY li.purchase_order_item_id
      ORDER BY sr.created_at DESC, sr.id DESC
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS received_from_this_receipt_on
  FROM public.sku_receiving_line_items li
  JOIN public.sku_receivings sr ON sr.id = li.sku_receiving_id
  JOIN public.purchase_order_items poi ON poi.id = li.purchase_order_item_id
)
UPDATE public.sku_receiving_line_items li
SET qty_expected = greatest(
  lh.ordered_qty - (lh.received_qty - lh.received_from_this_receipt_on),
  0
)
FROM line_history lh
WHERE li.id = lh.id
  AND li.qty_expected IS NULL;

ALTER TABLE public.sku_receiving_line_items
  ALTER COLUMN qty_expected SET NOT NULL;

-- 3. confirm_sku_receiving(): same as 033 plus qty_expected -----------------

CREATE OR REPLACE FUNCTION public.confirm_sku_receiving(
  p_purchase_order_id uuid,
  p_receipt_datetime timestamptz,
  p_receiving_location text,
  p_line_items jsonb,
  p_delivery_note_number text DEFAULT NULL,
  p_vehicle_ref text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_po_status public.purchase_order_status;
  v_receiving_id uuid;
  v_invalid_item uuid;
  v_has_rejects boolean;
  v_po_complete boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be logged in to receive goods.';
  END IF;

  IF NOT public.current_user_has_any_role(
    ARRAY['super_admin', 'operations_manager', 'store_keeper']
  ) THEN
    RAISE EXCEPTION 'You do not have permission to receive goods.';
  END IF;

  -- Lock the PO so concurrent receipts against it are serialized.
  SELECT status INTO v_po_status
  FROM purchase_orders
  WHERE id = p_purchase_order_id
  FOR UPDATE;

  IF v_po_status IS NULL THEN
    RAISE EXCEPTION 'Purchase order not found.';
  END IF;

  IF v_po_status NOT IN ('pending', 'partially_received', 'overdue') THEN
    RAISE EXCEPTION 'Purchase order is % and cannot be received.', v_po_status;
  END IF;

  CREATE TEMP TABLE _receiving_lines ON COMMIT DROP AS
  SELECT
    l.purchase_order_item_id,
    l.qty_received,
    l.qty_rejected,
    NULLIF(btrim(l.variance_reason), '') AS variance_reason
  FROM jsonb_to_recordset(p_line_items) AS l(
    purchase_order_item_id uuid,
    qty_received numeric,
    qty_rejected numeric,
    variance_reason text
  )
  WHERE coalesce(l.qty_received, 0) + coalesce(l.qty_rejected, 0) > 0;

  IF NOT EXISTS (SELECT 1 FROM _receiving_lines) THEN
    RAISE EXCEPTION 'Enter a received or rejected quantity for at least one line.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM _receiving_lines
    WHERE qty_received < 0 OR qty_rejected < 0
  ) THEN
    RAISE EXCEPTION 'Quantities cannot be negative.';
  END IF;

  -- Lock the PO lines and verify each incoming line belongs to this PO and
  -- does not exceed what is still outstanding.
  PERFORM 1
  FROM purchase_order_items
  WHERE purchase_order_id = p_purchase_order_id
  FOR UPDATE;

  SELECT l.purchase_order_item_id INTO v_invalid_item
  FROM _receiving_lines l
  LEFT JOIN purchase_order_items poi
    ON poi.id = l.purchase_order_item_id
   AND poi.purchase_order_id = p_purchase_order_id
  WHERE poi.id IS NULL
     OR l.qty_received + l.qty_rejected > poi.ordered_qty - poi.received_qty
  LIMIT 1;

  IF v_invalid_item IS NOT NULL THEN
    RAISE EXCEPTION 'Line % is not on this PO or exceeds the remaining quantity.',
      v_invalid_item;
  END IF;

  SELECT bool_or(qty_rejected > 0) INTO v_has_rejects FROM _receiving_lines;

  SELECT bool_and(
    poi.received_qty + coalesce(l.qty_received, 0) >= poi.ordered_qty
  ) INTO v_po_complete
  FROM purchase_order_items poi
  LEFT JOIN _receiving_lines l ON l.purchase_order_item_id = poi.id
  WHERE poi.purchase_order_id = p_purchase_order_id;

  INSERT INTO sku_receivings (
    purchase_order_id,
    receipt_datetime,
    delivery_note_number,
    received_by,
    receiving_location,
    vehicle_ref,
    status,
    notes
  ) VALUES (
    p_purchase_order_id,
    coalesce(p_receipt_datetime, now()),
    NULLIF(btrim(p_delivery_note_number), ''),
    v_user_id,
    p_receiving_location,
    NULLIF(btrim(p_vehicle_ref), ''),
    CASE
      WHEN v_has_rejects THEN 'variance_flagged'
      WHEN v_po_complete THEN 'received'
      ELSE 'partially_received'
    END::sku_receiving_status,
    NULLIF(btrim(p_notes), '')
  )
  RETURNING id INTO v_receiving_id;

  -- sku_id comes from the PO line, never from the client.
  -- qty_expected is captured before received_qty is bumped below, so it is
  -- what was still outstanding when this delivery arrived.
  INSERT INTO sku_receiving_line_items (
    sku_receiving_id,
    purchase_order_item_id,
    sku_id,
    qty_expected,
    qty_received,
    qty_rejected,
    variance_reason
  )
  SELECT
    v_receiving_id,
    l.purchase_order_item_id,
    poi.sku_id,
    poi.ordered_qty - poi.received_qty,
    l.qty_received,
    l.qty_rejected,
    l.variance_reason
  FROM _receiving_lines l
  JOIN purchase_order_items poi ON poi.id = l.purchase_order_item_id;

  UPDATE purchase_order_items poi
  SET received_qty = poi.received_qty + l.qty_received
  FROM _receiving_lines l
  WHERE poi.id = l.purchase_order_item_id
    AND l.qty_received > 0;

  -- Stock row normally exists (skus trigger), upsert is a safety net.
  INSERT INTO inventory_stock (sku_id, on_hand_qty)
  SELECT poi.sku_id, sum(l.qty_received)
  FROM _receiving_lines l
  JOIN purchase_order_items poi ON poi.id = l.purchase_order_item_id
  WHERE l.qty_received > 0
  GROUP BY poi.sku_id
  ON CONFLICT (sku_id) DO UPDATE
  SET on_hand_qty = inventory_stock.on_hand_qty + EXCLUDED.on_hand_qty;

  UPDATE purchase_orders
  SET status = CASE
    WHEN v_po_complete THEN 'closed'
    ELSE 'partially_received'
  END::purchase_order_status
  WHERE id = p_purchase_order_id;

  RETURN v_receiving_id;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_sku_receiving(
  uuid, timestamptz, text, jsonb, text, text, text
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.confirm_sku_receiving(
  uuid, timestamptz, text, jsonb, text, text, text
) TO authenticated;

-- 4. List view: qty_expected appended (OR REPLACE only allows new columns at
--    the end; existing columns keep their names and order) ------------------

CREATE OR REPLACE VIEW public.sku_receivings_list
WITH (security_invoker = true) AS
SELECT
  sr.id,
  sr.purchase_order_id,
  po.po_number,
  po.supplier_id,
  s.name AS supplier_name,
  sr.receipt_datetime,
  sr.receiving_location,
  sr.status,
  sr.created_at,
  count(li.id)::int AS sku_count,
  coalesce(sum(poi.ordered_qty), 0) AS qty_ordered,
  coalesce(sum(li.qty_received), 0) AS qty_received,
  coalesce(sum(li.qty_rejected), 0) AS qty_rejected,
  coalesce(sum(li.qty_expected), 0) AS qty_expected
FROM public.sku_receivings sr
JOIN public.purchase_orders po ON po.id = sr.purchase_order_id
LEFT JOIN public.suppliers s ON s.id = po.supplier_id
LEFT JOIN public.sku_receiving_line_items li ON li.sku_receiving_id = sr.id
LEFT JOIN public.purchase_order_items poi ON poi.id = li.purchase_order_item_id
GROUP BY sr.id, po.id, s.id;

REVOKE ALL ON public.sku_receivings_list FROM PUBLIC, anon;
GRANT SELECT ON public.sku_receivings_list TO authenticated;
