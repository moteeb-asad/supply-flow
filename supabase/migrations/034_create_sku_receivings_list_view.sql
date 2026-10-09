-- Read model for the SKU Receiving list: one row per receipt with PO/supplier
-- info and line totals aggregated in SQL, so the list can paginate, search and
-- filter in a single query.
--
-- security_invoker = true makes the view run with the caller's permissions,
-- so the RLS policies on the underlying tables still apply.

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
  coalesce(sum(li.qty_rejected), 0) AS qty_rejected
FROM public.sku_receivings sr
JOIN public.purchase_orders po ON po.id = sr.purchase_order_id
LEFT JOIN public.suppliers s ON s.id = po.supplier_id
LEFT JOIN public.sku_receiving_line_items li ON li.sku_receiving_id = sr.id
LEFT JOIN public.purchase_order_items poi ON poi.id = li.purchase_order_item_id
GROUP BY sr.id, po.id, s.id;

REVOKE ALL ON public.sku_receivings_list FROM PUBLIC, anon;
GRANT SELECT ON public.sku_receivings_list TO authenticated;
