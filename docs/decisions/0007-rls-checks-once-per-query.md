# 0007. RLS role and user checks run once per query

- Status: Accepted
- Date: 2026-11-11
- Area: Database
- Related: migration `051_wrap_rls_role_checks_in_select.sql`, card "Performance at scale: RLS role checks run per row (timeouts on dashboard, SKU receiving, inventory)"

## Context

On a seeded local database (100,000 purchase orders, ~110,000 receipts) the dashboard metrics, the SKU receiving list and the inventory screen hit the authenticated role's 8 s `statement_timeout`. 20 of the 26 policies that check roles called `current_user_has_any_role(...)` and `auth.uid()` directly, so Postgres ran the check once for every row it scanned.

## Decision

Every RLS policy wraps these calls in `(SELECT ...)`, e.g. `(SELECT current_user_has_any_role(ARRAY['super_admin']))` and `(SELECT auth.uid())`. Postgres then evaluates each call once per statement (an InitPlan) and reuses the result.

Migration 051 applies this with `ALTER POLICY ... USING / WITH CHECK`, generated from the live production policies (27 policies changed; ones already wrapped are left alone). New policies must follow the same pattern.

## What 051 changes on production

27 policies on 9 tables. Only the `USING` / `WITH CHECK` expressions change (the call is wrapped); each policy's name, command and roles stay the same. Last defined in these migrations:

| Table                      | Policies changed                                                                                                                                                                     | Originally from |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| `purchase_orders`          | `purchase_orders_select_by_role`, `purchase_orders_insert_ops_admin`, `purchase_orders_update_ops_admin`                                                                             | 011             |
| `purchase_order_items`     | `purchase_order_items_select_by_role`, `purchase_order_items_insert_ops_admin`, `purchase_order_items_update_ops_admin` (011), `purchase_order_items_delete_ops_admin` (013)         | 011, 013        |
| `sku_receivings`           | `sku_receivings_select_ops_roles`, `sku_receivings_insert_ops_roles`, `sku_receivings_update_ops_roles`, `sku_receivings_delete_super_admin`                                         | 031             |
| `sku_receiving_line_items` | `sku_receiving_line_items_select_ops_roles`, `sku_receiving_line_items_insert_ops_roles`, `sku_receiving_line_items_update_ops_roles`, `sku_receiving_line_items_delete_super_admin` | 032             |
| `skus`                     | `skus_insert_ops_admin`, `skus_update_ops_admin`, `skus_delete_super_admin`                                                                                                          | 020             |
| `sku_suppliers`            | `sku_suppliers_select_ops_roles`, `sku_suppliers_insert_ops_admin`, `sku_suppliers_update_ops_admin`, `sku_suppliers_delete_super_admin`                                             | 021             |
| `inventory_stock`          | `inventory_stock_insert_ops_roles`, `inventory_stock_update_ops_roles`, `inventory_stock_delete_super_admin`                                                                         | 022             |
| `profiles`                 | `Users can read own profile`                                                                                                                                                         | 003             |
| `user_roles`               | `Users can read own roles`                                                                                                                                                           | 003             |

**Not changed** (already wrapped, or no role check): `categories` (all 4, from 043), `suppliers` (`suppliers_select`, `suppliers_update` 044, `suppliers_insert` 045), `inventory_stock_select_inventory_roles` (042), `roles` (`All users can read roles`), and the service-role insert policies on `profiles` and `user_roles`.

**Gets faster, no code change** (these read the tables above with the caller's RLS):

- View `sku_receivings_list` (`security_invoker = true`): SKU receiving list
- `SECURITY INVOKER` functions: `get_dashboard_metrics` (039), `get_recent_receiving_activity` (040), `get_supplier_performance_trends` (041), `get_sku_receiving_metrics` (035), `get_purchase_order_metrics` (048), `get_inventory_metrics` (049), `get_supplier_overview_metrics` (050), `add_inventory_item_transaction` (026)
- Direct table reads from server actions: PO list and detail, inventory list, receivable PO lookup

**Not affected:** `SECURITY DEFINER` functions skip RLS, so `confirm_sku_receiving` (036), `current_user_has_any_role` and `sync_role_to_app_metadata` behave exactly as before. `mark_overdue_purchase_orders` (047) runs from `pg_cron` as `postgres`, which also bypasses RLS.

## Why

- The fix is mechanical and changes no rule: same inputs, same result, only how often the check runs.
- Measured locally as a signed-in user: SKU receiving list 12.9 s to 0.31 s, dashboard metrics 9.3 s to 0.05 s. Every screen query is now under 0.35 s.
- Visible row counts per role (super admin, operations manager, store keeper) across all 13 tables and views are identical before and after.
- `ALTER POLICY` keeps each policy's command and roles, so there is no window where a policy is missing (unlike drop and re-create).

## Alternatives considered

- **Reuse the old local migration** (`20261019000000_wrap_rls_role_checks_in_select.sql` in the local test folder). It was written against the 17 Oct schema and would undo migrations 042-045.
- **Raise `statement_timeout`.** Hides the problem; queries would still get slower with data.
- **Check roles from the JWT** (`auth.jwt() -> 'app_metadata'`) instead of a function. Also fast, but changes where the role comes from; that belongs to the card "User roles live in two places".

## Consequences

- Any new policy must wrap role and user checks in `(SELECT ...)`, or the per-row cost comes back.
- The 6 policies wrapped earlier keep their `AS current_user_has_any_role` alias form; behaviour is the same.
