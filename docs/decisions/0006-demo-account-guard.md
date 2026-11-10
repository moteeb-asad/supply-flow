# 0006. Shared demo account: password change and invites are turned off

- Status: Accepted
- Date: 2026-11-10
- Area: Frontend, server actions
- Related: card "Shared demo account can change its password and manage users", branch `fix/demo-account-guard`

## Context

`demo@supplyflow.com` is a super admin account handed out with job applications. Any visitor could change its password on the Account page and lock out every other reviewer, or send real invite emails (which also uses the Supabase email rate limit).

## Decision

Identify the demo account by its email (`DEMO_ACCOUNT_EMAIL` in `src/features/auth/utils/demo-account.ts`) and turn two actions off for it, on both sides:

- **Change password:** the button on the Account page is disabled with a short note; the `changePassword` server action refuses with the same message.
- **Send invite:** the "Invite user" button and the modal's "Send invite" button are disabled (the modal also opens from `?modal=invite-user`); `inviteUserAction` refuses.

## Why

- Smallest change that stops the realistic problems: a reviewer locking out the next one, and invite emails going out.
- Client and server both check, so clicking is blocked and so are direct server action calls.
- One constant in code; no schema change, no new config.

## Alternatives considered

- **`profiles.is_demo` flag plus a `BEFORE UPDATE` trigger on `auth.users`** blocking password and email changes at the database. Also stops a visitor calling `supabase.auth.updateUser()` from the browser console, and password resets through the "Forgot password" email. Heavier (migration, trigger on the auth schema); kept for later if it becomes a problem.
- **A separate demo database or seed reset.** Out of scope for now.

## Consequences

- A determined visitor can still change the password from the browser console with `supabase.auth.updateUser()`, since that bypasses the app. Reset the password in the Supabase dashboard if that happens, or move to the trigger above.
- Renaming the demo account means updating `DEMO_ACCOUNT_EMAIL`.
- Other admin powers (editing or cancelling live data) remain available to the demo account.
