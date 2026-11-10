# Decisions

Why SupplyFlow is built the way it is. One short file per decision, so that months later anyone can see what was chosen, why, and what was turned down.

Add a record when a choice is hard to reverse or would surprise someone reading the code: a schema change, a background job, a rule the UI depends on. Commit it in the same branch as the change it explains.

## Index

| #                                         | Decision                                                        | Area                     | Date       |
| ----------------------------------------- | --------------------------------------------------------------- | ------------------------ | ---------- |
| [0001](0001-po-closed-at-column.md)       | Store when a purchase order was closed                          | Database                 | 2026-11-10 |
| [0002](0002-auto-overdue-with-pg-cron.md) | Mark purchase orders overdue automatically                      | Database                 | 2026-11-10 |
| [0003](0003-metrics-computed-on-read.md)  | Screen metrics are computed in the database on read             | Database, frontend       | 2026-11-10 |
| [0004](0004-inventory-metrics.md)         | Inventory metrics: what each card counts                        | Database, frontend       | 2026-11-10 |
| [0005](0005-supplier-overview-metrics.md) | Supplier list metrics: performance means on-time delivery       | Database, frontend       | 2026-11-10 |
| [0006](0006-demo-account-guard.md)        | Shared demo account: password change and invites are turned off | Frontend, server actions | 2026-11-10 |

## Template

Copy this into `NNNN-short-title.md`, using the next number.

```markdown
# NNNN. Title

- Status: Accepted | Superseded by NNNN
- Date: YYYY-MM-DD
- Area: Database | Frontend | Database, frontend
- Related: migration / PR / project card

## Context

What problem or question led to this.

## Decision

What we do now.

## Why

The reasons this option won.

## Alternatives considered

Each option we turned down, and why.

## Consequences

What this costs or changes, and what to watch for.
```
