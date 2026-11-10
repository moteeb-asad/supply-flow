# 0003. Screen metrics are computed in the database on read

- Status: Accepted
- Date: 2026-11-10
- Area: Database, frontend
- Related: card "Compute all screen metrics in the database (SQL functions)", PR #48, existing `get_dashboard_metrics` (039) and `get_sku_receiving_metrics` (035)

## Context

Metric cards were either hard-coded or counted in the browser. The purchase orders cards downloaded up to 1000 full rows and counted them, so they were wrong past 1000 POs and slow.

## Decision

- **One SQL function per screen** that aggregates live data and returns one small row (for example `get_purchase_order_metrics(p_timezone)`). `SECURITY INVOKER`, so row-level security applies.
- **Computed on every read; nothing is stored.** No background job is needed to keep metrics current. The only scheduled job is the overdue status sweep in [0002](0002-auto-overdue-with-pg-cron.md), because that is a stored status, not a metric.
- **Metrics are independent of the table.** Search, filters and status tabs never change them; the functions take no filter parameters, and the metrics query key is separate from the table key.
- **Freshness in the app:** loaded with React Query under the feature key prefix (for example `["purchase-orders", "metrics"]`). It refetches on window focus after 60 seconds, after create, edit or receive (key invalidation), and on a polling interval for changes made by other users. A failed load shows `—`, never a fake zero.
- A `p_timezone` parameter where "today" or "this month" matters.

## Why

- Correct at any data size, and only a few numbers cross the network.
- One pattern for every screen, already proven by the dashboard and SKU receiving.
- Nothing to keep in sync, so no stale numbers and no extra jobs as screens are added.

## Alternatives considered

- **Count in the browser.** Wrong past the download limit and wasteful.
- **Store totals in a summary table** updated by triggers or jobs. Faster at very large scale, but every write path must keep it right. Not needed at this size.
- **Metrics follow the table filters.** Rejected: the cards show whole-business figures.

## Consequences

- Each screen needs a migration for its function, plus indexes for the columns it filters on.
- Money metrics must respect price visibility rules (card "Hide prices from store keepers").
- A future time-based status (such as expired invitations) should be derived on read first; only store it, and add it to the existing hourly job, if tabs or filters need it.
