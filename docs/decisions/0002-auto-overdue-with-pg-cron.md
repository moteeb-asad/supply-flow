# 0002. Mark purchase orders overdue automatically

- Status: Accepted
- Date: 2026-11-10
- Area: Database
- Related: migration `047_auto_mark_overdue_purchase_orders.sql`, PR #48

## Context

Nothing ever set a PO's status to `overdue`. The Overdue tab and the Overdue card only showed POs that someone had marked by hand, so late orders were easy to miss.

## Decision

The database keeps `overdue` up to date:

1. **Trigger `purchase_orders_set_overdue_status`** (on insert, and on changes to `status` or `expected_delivery_date`). A `pending` or `partially_received` PO past its date becomes `overdue` at once. An `overdue` PO whose date moves into the future, or is cleared, goes back to `partially_received` if anything has been received, otherwise `pending`.
2. **Function `mark_overdue_purchase_orders()`**, run by `pg_cron` every hour (`5 * * * *`, job `mark-overdue-purchase-orders`). It catches POs that became late only because time passed, which a trigger cannot see.

Rules: only POs still waiting for goods (`pending`, `partially_received`, `overdue`) are affected. Drafts, closed and cancelled POs are never touched. Overdue wins over partially received. "Today" is the UTC date. No expected date means never overdue.

## Why

- The status drives the Overdue tab and filters, so it has to be stored and correct.
- `pg_cron` runs inside Postgres: no extra server, no separate charge on Supabase, and the hourly query is tiny and indexed on `status`.

## Alternatives considered

- **Work out overdue on read** (a view or query rule instead of a stored status). Always exact and needs no job, but every PO query, tab, filter and status pill would have to read through it. Worth revisiting if more time-based states appear.
- **Manual status only** (what we had). Relies on people remembering.
- **An app-side scheduler** (Vercel Cron calling an API route). Works, but adds a route, a secret and a second moving part for something the database can do itself.

## Consequences

- Setting a late PO back to "Pending" by hand does not stick; moving its expected date forward is how to clear overdue.
- Portability: if a future host has no `pg_cron`, migration 047 skips scheduling with a notice. Call `mark_overdue_purchase_orders()` from any other scheduler instead.
- Supabase free projects pause after about a week of no activity, and the job does not run while paused. It catches up on the first run after resuming.
- `cron.job_run_details` gains one row per run (about 8,760 a year); clear old rows if needed.
- Metrics count "past expected date" directly, so they are right even between runs (see [0003](0003-metrics-computed-on-read.md)).
