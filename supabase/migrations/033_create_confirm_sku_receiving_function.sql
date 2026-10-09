-- Confirm an SKU receiving in a single transaction:
--   1. insert sku_receivings header
--   2. insert sku_receiving_line_items (lines with qty > 0 only)
--   3. purchase_order_items.received_qty += qty_received (accepted qty only;
--      rejected qty stays outstanding on the PO for re-delivery)
--   4. inventory_stock.on_hand_qty += qty_received
--   5. purchase_orders.status -> 'closed' when every line is fully received,
--      otherwise 'partially_received'
--
-- SECURITY DEFINER because store_keeper has no UPDATE rights on
-- purchase_order_items / purchase_orders / inventory_stock; the role check
-- below is the gate instead.

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
  INSERT INTO sku_receiving_line_items (
    sku_receiving_id,
    purchase_order_item_id,
    sku_id,
    qty_received,
    qty_rejected,
    variance_reason
  )
  SELECT
    v_receiving_id,
    l.purchase_order_item_id,
    poi.sku_id,
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
