-- Latest received line items for the dashboard "Recent Receiving Activity"
-- widget: one row per SKU line, newest receipt first.
--
-- Scales with table size: ORDER BY receipt_datetime DESC + LIMIT walks the
-- sku_receivings_receipt_datetime_idx index and joins only the few rows
-- returned, so the cost does not grow with the number of receipts.
--
-- p_limit is clamped to 1..50.
--
-- SECURITY INVOKER: runs with the caller's RLS (all receiving roles can read
-- receipts, line items, POs, suppliers and SKUs).

CREATE OR REPLACE FUNCTION public.get_recent_receiving_activity(
  p_limit int DEFAULT 5
)
RETURNS TABLE (
  line_item_id uuid,
  receiving_id uuid,
  receipt_datetime timestamptz,
  receipt_status text,
  po_number text,
  supplier_name text,
  sku_code text,
  sku_name text,
  unit text,
  qty_received numeric,
  qty_rejected numeric
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    li.id,
    sr.id,
    sr.receipt_datetime,
    sr.status::text,
    po.po_number,
    s.name,
    sk.sku_code,
    sk.name,
    sk.unit,
    li.qty_received,
    li.qty_rejected
  FROM sku_receivings sr
  JOIN sku_receiving_line_items li ON li.sku_receiving_id = sr.id
  JOIN purchase_orders po ON po.id = sr.purchase_order_id
  JOIN skus sk ON sk.id = li.sku_id
  LEFT JOIN suppliers s ON s.id = po.supplier_id
  ORDER BY sr.receipt_datetime DESC, sr.id DESC, sk.sku_code
  LIMIT least(greatest(coalesce(p_limit, 5), 1), 50);
$$;

REVOKE ALL ON FUNCTION public.get_recent_receiving_activity(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_recent_receiving_activity(int) TO authenticated;
