# 0005. Supplier list metrics: performance means on-time delivery

- Status: Accepted
- Date: 2026-11-10
- Area: Database, frontend
- Related: migration `050_create_get_supplier_overview_metrics_function.sql`, PR #48, follows [0003](0003-metrics-computed-on-read.md)

## Context

The suppliers list showed hard-coded cards: 42 active suppliers, an 88% "average performance score" with "+2.4%", and $1.24M spend. Nothing in the app defined a performance score.

## Decision

`get_supplier_overview_metrics(p_timezone)` returns one row, computed on read:

- **Active suppliers:** `suppliers.status = 'active'`.
- **Average performance score = on-time delivery rate this year:** receipts that arrived, in the user's timezone, on or before their PO's expected delivery date, divided by all receipts since 1 January. Receipts on POs with no expected date are left out. Rounded to one decimal; null when there were no deliveries this year (the card shows "—").
- **Total spend this year:** sum of `total_amount` for POs ordered since 1 January, excluding drafts and cancelled.

The function also returns the delivery and on-time counts, so the card can say "10 of 17 deliveries on time this year". The "+2.4%" trend was removed.

## Why

- **On-time rate** is the rule the dashboard's supplier trend chart already uses (migration 041), so the screens agree, and it is easy to explain.
- **This year** matches "Total spend this year" on the same strip.
- **Spend** uses the dashboard spend rule (migration 039): money actually committed, not drafts or cancelled orders.
- **No trend:** the user chose to show the score alone.

## Alternatives considered

- **Blend on-time and fill rate** (accepted / expected quantity). Rewards complete deliveries too, but it is an invented formula users would have to learn. Fill rate fits better on the supplier detail page.
- **Last 90 days or all time.** 90 days reacts faster; all time is steadier. Both would differ from the spend card's window.
- **Trend versus last year.** Real, but not wanted for now.

## Consequences

- Early in the year the score rests on few deliveries and can swing; the "x of y deliveries" caption makes that visible.
- Each receipt counts once, so a PO delivered in several parts counts once per delivery.
- Only super admins and operations managers can open the suppliers page, so store keepers never see the spend figure.
