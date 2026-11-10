-- Metric cards for the inventory screen, computed in one round trip.
-- Replaces the hard-coded placeholders in InventoryMetrics.tsx.
--
-- Whole-business figures: no search, filter or tab parameters
-- (docs/decisions/0003). No timezone: nothing here depends on "today".
--
-- Stock levels use the computed inventory_stock.stock_status (migration 028):
-- critical <= 20 units, low <= 50 units. The two counts below do not overlap,
-- so an item with 0 units counts as out of stock, not as low stock.
--
-- SECURITY INVOKER: runs with the caller's RLS. All three inventory roles can
-- read inventory_stock (migration 042) and skus.

CREATE OR REPLACE FUNCTION public.get_inventory_metrics()
RETURNS TABLE (
  total_stock_value numeric,
  low_stock_count int,
  out_of_stock_count int
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    -- Units on hand valued at each SKU's standard unit price.
    coalesce(sum(st.on_hand_qty * s.standard_unit_price), 0),

    -- At or below the low threshold but not empty.
    (count(*) FILTER (
      WHERE st.stock_status IN ('low', 'critical') AND st.on_hand_qty > 0
    ))::int,

    -- Nothing left on hand.
    (count(*) FILTER (WHERE st.on_hand_qty = 0))::int
  FROM inventory_stock st
  JOIN skus s ON s.id = st.sku_id;
$$;

REVOKE ALL ON FUNCTION public.get_inventory_metrics() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_inventory_metrics() TO authenticated;
