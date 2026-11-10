# 0001. Store when a purchase order was closed

- Status: Accepted
- Date: 2026-11-10
- Area: Database
- Related: migration `046_add_closed_at_to_purchase_orders.sql`, PR #48, card "Compute all screen metrics in the database (SQL functions)"

## Context

The purchase orders screen shows "Completed this month". The table had no record of when a PO was closed, so the card counted every closed PO ever.

## Decision

Add `purchase_orders.closed_at timestamptz`, maintained by the trigger `purchase_orders_set_closed_at`:

- status becomes `closed`: set `closed_at = now()`
- a closed PO is saved as closed again: keep the first close time
- status moves away from `closed`: clear `closed_at`

Existing closed POs were backfilled from their latest receipt (`sku_receivings.receipt_datetime`), falling back to `updated_at`. All 4 closed POs at the time had receipts.

The PO list shows the date in a "Closed On" column.

## Why

- A PO closes in two places: `confirm_sku_receiving` when the last line is received, and the edit drawer when someone sets it by hand. A trigger covers both without changing either.
- An exact timestamp makes "this month" a simple indexed filter.

## Alternatives considered

- **Use the last receipt date.** No schema change, but POs closed by hand without a receipt would never count, and a later edit could not be told apart from the close.
- **Use `updated_at`.** Changes on any edit, so it is not the close date.
- **Set the date in the app.** Easy to miss in one of the two code paths, and the database would not enforce it.

## Consequences

- Reopening a closed PO clears its close date; closing it again records the new time.
- A partial index on `closed_at` keeps month filters fast.
