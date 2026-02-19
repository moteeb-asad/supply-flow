# AdminClient Security Guidelines

## ⚠️ Critical Security Rules

When using `adminClient` (Supabase service role key) in this project, **strictly follow these rules**:

---

## 1. Server-Side Only

✅ **DO**: Use adminClient only in:

- Server Actions (`"use server"`)
- Server-only modules (in `/app` route handlers with no client access)
- API routes

❌ **DON'T**:

- Never import or use adminClient in Client Components
- Never expose the service role key to the browser
- Never pass adminClient as a prop or context

---

## 2. Explicit Permission Checks BEFORE Use

✅ **DO**: Always verify user authorization BEFORE calling adminClient:

```typescript
"use server";

import { createClient } from "@/src/db/supabaseClient";
import { createAdminClient } from "@/src/db/supabaseAdmin";

export async function adminOnlyAction() {
  const supabase = await createClient();

  // Step 1: Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Step 2: Check permission from JWT metadata (non-recursive)
  const userRole = user.user_metadata?.primary_role;

  if (userRole !== "super_admin") {
    console.warn(`Unauthorized access attempt by user ${user.id}`);
    return { error: "Access denied. Admin role required." };
  }

  // Step 3: Now safe to use adminClient
  const adminClient = createAdminClient();
  const { data } = await adminClient.from("sensitive_table").select("*");

  return { data };
}
```

❌ **DON'T**:

- Never rely on adminClient itself as the permission check
- Don't assume that just because it's a Server Action, it's secure
- adminClient bypasses ALL RLS - always check permissions first

---

## 3. Non-Recursive Permission Checks

✅ **DO**: Check permissions from JWT metadata or app_metadata:

```typescript
// Good: No database query needed
const userRole = user.user_metadata?.primary_role;
const isAdmin = userRole === "super_admin";
```

❌ **DON'T**: Query the database to check permissions (causes RLS recursion):

```typescript
// Bad: This queries profiles, which triggers RLS, which checks if user is admin...
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();
```

**Why?** If your RLS policy checks "is user super_admin?" by querying profiles, and you query profiles to check "is user super_admin?", you create infinite recursion.

---

## 4. Fail Fast on Unauthorized Access

✅ **DO**: Return immediately if unauthorized:

```typescript
if (userRole !== "super_admin") {
  return { success: false, error: "Access denied" };
}
```

✅ **DO**: Log unauthorized attempts:

```typescript
console.warn(`Unauthorized access attempt to ${actionName} by user ${user.id}`);
```

❌ **DON'T**:

- Silently fail
- Continue with adminClient if unauthorized

---

## 5. Isolated Admin Logic

✅ **DO**: Keep admin functions in clearly marked files:

- `/src/features/*/actions/*-admin.actions.ts`
- Clearly document which actions are admin-only

❌ **DON'T**:

- Create shared utilities that conditionally switch between regular client and adminClient
- Mix admin and regular user logic in the same function

```typescript
// Bad: Conditional client selection
const client = isAdmin ? createAdminClient() : supabase;

// Good: Separate functions
async function regularUserAction() {
  const supabase = await createClient();
  // ...
}

async function adminOnlyAction() {
  // Check permission first
  const adminClient = createAdminClient();
  // ...
}
```

---

## 6. Clear Documentation

✅ **DO**: Add security documentation to admin functions:

```typescript
/**
 * Server Action: Get all users (ADMIN ONLY)
 *
 * SECURITY:
 * - Only super_admin users can access this
 * - Permission check via JWT metadata (non-recursive)
 * - adminClient used AFTER authorization verified
 *
 * @returns User list or error
 */
export async function getUsersAction() {
  // ...
}
```

---

## When to Use AdminClient

### ✅ Legitimate Use Cases:

1. **Admin-only features**: User management, system configuration
2. **Auth operations**: Create user, invite user, delete user (via auth.admin API)
3. **Bulk operations**: Admin actions that need to operate on many records
4. **System tasks**: Background jobs, migrations, analytics

### ❌ Never Use For:

1. **Regular user features**: Viewing own profile, updating own data
2. **Public data**: Data that all users should see
3. **Without permission checks**: ALWAYS check permissions first

---

## Architecture Pattern Summary

```
┌─────────────────────────────────────────────────────┐
│  Client Component                                    │
│  - No database access                               │
│  - Calls Server Action                              │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Server Action ("use server")                       │
│  1. Get authenticated user (regular client)         │
│  2. Check JWT metadata: is super_admin?             │
│  3. If NO → Return 403 error                        │
│  4. If YES → Use adminClient safely                 │
└─────────────────────────────────────────────────────┘
```

---

## Example: Correct Implementation

See [src/features/settings/users/actions/get-users.actions.ts](../src/features/settings/users/actions/get-users.actions.ts) for a complete, production-safe example.

**Key points:**

- ✅ Server Action only
- ✅ Permission check via JWT metadata (no database query)
- ✅ Fails fast if unauthorized
- ✅ adminClient instantiated AFTER permission check
- ✅ Clear documentation
- ✅ Logging of unauthorized attempts

---

## Testing Checklist

Before deploying admin functionality:

- [ ] Verified adminClient is never imported in Client Components
- [ ] Permission check happens before ANY adminClient operation
- [ ] Permission check uses JWT metadata (non-recursive)
- [ ] Unauthorized access returns 403 error
- [ ] Unauthorized attempts are logged
- [ ] Function is clearly documented as admin-only
- [ ] Tested that non-admin users cannot access the feature

---

## Questions?

If you're unsure whether to use adminClient for a feature, ask:

1. **Is this admin-only?** If regular users need it, use regular client with RLS
2. **Can I check permissions without a database query?** Use JWT metadata
3. **Have I verified the user is authorized BEFORE touching adminClient?** Must check first

**When in doubt, prefer RLS over adminClient** - it's more secure by default.
