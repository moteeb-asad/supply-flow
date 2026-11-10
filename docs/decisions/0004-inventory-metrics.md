# 0004. Inventory metrics: what each card counts

- Status: Accepted
- Date: 2026-11-10
- Area: Database, frontend
- Related: migration `049_create_get_inventory_metrics_function.sql`, PR #48, follows [0003](0003-metrics-computed-on-read.md)

## Context

The inventory screen's three cards were hard-coded ($1,248,500.00, 14 items, 3 SKUs) with made-up captions ("+2.4% vs last month", "2 since yesterday"). They needed real figures, using the pattern in 0003.

## Decision

`get_inventory_metrics()` returns one row, computed on read from `inventory_stock` joined to `skus`:

- **Total stock value:** `sum(on_hand_qty * standard_unit_price)`.
- **Low stock:** items with `stock_status` `low` or `critical` (50 units or fewer) that still have stock (`on_hand_qty > 0`).
- **Out of stock:** items with `on_hand_qty = 0`.

No timezone parameter: nothing depends on "today". `SECURITY INVOKER`; all three roles can read stock (migration 042) and SKUs.

In the app: `inventoryKeys.metrics` sits under `inventoryKeys.all`, so adding an item or receiving goods refreshes the cards at once, and they poll every 60 seconds. The "Action required" pill shows only when low stock is above 0. The comparison captions were removed.

## Why

- **Standard unit price** is the only price every SKU has. The last purchase price would depend on PO history and be empty for new items.
- **Low and out of stock do not overlap**, so the two cards never count the same item and add up to the items that need attention.
- **The existing `stock_status` thresholds** (critical ≤ 20, low ≤ 50, migration 028) keep the cards consistent with the table's stock pills and filters.
- **No history, no comparison captions.** Nothing records past stock levels, so "vs last month" or "since yesterday" could not be real.

## Alternatives considered

- **Value at last purchase price.** More accurate for cost, but needs PO history per SKU and is empty for items never ordered.
- **Low stock includes empty items** (as the dashboard's low-stock KPI does). Simpler, but the low and out-of-stock cards would double count.
- **Per-item reorder levels.** Better than one threshold for all items, but no such column exists yet.
- **Store daily stock snapshots** to show trends. Possible later; not needed for the cards.

## Consequences

- The dashboard low-stock KPI counts empty items as low, so the two screens can differ when an item reaches 0.
- Store keepers see the stock value. Hiding money from them belongs to the "Hide prices from store keepers" card.
- A trend caption needs a stock history table first.
