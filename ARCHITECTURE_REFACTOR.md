# User Management Architecture Refactor

## Overview

This refactor removes `adminClient` (service role) from runtime data fetching and implements proper RLS-based security. All user data now comes from application tables instead of the auth API.

---

## 🎯 Key Changes

### 1. **Database Schema Updates**

- Added `email` column to `profiles` table (was previously only in auth.users)
- Added `last_sign_in_at` column to `profiles` table
- Both fields are now managed in application tables

### 2. **RLS Security Implementation**

- Enabled Row Level Security on all tables
- Super admins can read all profiles/user_roles
- Regular users can read their own profile and roles
- All authenticated users can read roles (reference data)

### 3. **Code Refactor**

- `getUsersAction` now uses only regular `supabase` client
- Removed `auth.admin.listUsers()` from runtime
- Uses Supabase joins to fetch related data efficiently
- No more `adminClient` for data fetching

---

## 📋 Implementation Steps

### Step 1: Run Database Migrations

Navigate to Supabase SQL Editor and run these migrations in order:

#### **Migration 1: Add Columns**

```bash
File: supabase/migrations/002_add_email_last_signin_to_profiles.sql
```

```sql
-- Add email and last_sign_in_at columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE NOT NULL,
ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMPTZ;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Add comments
COMMENT ON COLUMN profiles.email IS 'User email stored in profiles for easy access without auth.admin API';
COMMENT ON COLUMN profiles.last_sign_in_at IS 'Last sign in timestamp, updated by trigger or manually';
```

⚠️ **Note**: If you already have profiles without email, you'll need to populate them first or change to `ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;` (remove NOT NULL temporarily).

#### **Migration 2: Enable RLS and Create Policies**

```bash
File: supabase/migrations/003_rls_policies.sql
```

```sql
-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Super admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can read all user roles" ON user_roles;
DROP POLICY IF EXISTS "All authenticated users can read roles" ON roles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own roles" ON user_roles;

-- =====================================================================
-- ROLES TABLE: Allow all authenticated users to read (reference data)
-- =====================================================================
CREATE POLICY "All authenticated users can read roles"
ON roles FOR SELECT
USING (auth.uid() IS NOT NULL);

-- =====================================================================
-- PROFILES TABLE: Super admins can read all, users can read own
-- =====================================================================
CREATE POLICY "Super admins can read all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles current_user
    JOIN roles r ON current_user.primary_role_id = r.id
    WHERE current_user.id = auth.uid()
    AND r.name = 'super_admin'
  )
);

CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (id = auth.uid());

-- =====================================================================
-- USER_ROLES TABLE: Super admins can read all, users can read own
-- =====================================================================
CREATE POLICY "Super admins can read all user roles"
ON user_roles FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles current_user
    JOIN roles r ON current_user.primary_role_id = r.id
    WHERE current_user.id = auth.uid()
    AND r.name = 'super_admin'
  )
);

CREATE POLICY "Users can read own roles"
ON user_roles FOR SELECT
USING (user_id = auth.uid());
```

---

### Step 2: Update Existing Profile Records

If you have existing profiles without email, run this:

```sql
-- Populate email from auth.users (run once)
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND p.email IS NULL;
```

---

### Step 3: Recreate Super Admin

Since we added new fields, recreate your super admin:

```bash
npx tsx scripts/create-root-admin.ts
```

This will now create a profile with:

- `email` populated
- `last_sign_in_at` set to null (will update on login)
- All role assignments

---

### Step 4: Test the Changes

1. **Log out and log back in** (refresh JWT token)
2. Navigate to User Management page
3. Check browser console for any errors
4. Verify users list loads correctly with roles

---

## 🏗️ Architecture Changes

### Before (❌ Security Risk)

```typescript
// Using service role key in runtime!
const adminClient = createAdminClient();
const { data } = await adminClient.from("profiles").select("*");
const { data: authData } = await adminClient.auth.admin.listUsers();
```

**Problems:**

- Service role bypasses all RLS
- `auth.admin.listUsers()` is expensive and unscalable
- No proper security boundaries
- Data scattered between auth.users and profiles

### After (✅ Secure & Scalable)

```typescript
// Using regular client with RLS
const supabase = await createClient();
const { data: profiles } = await supabase.from("profiles").select(`
    id,
    full_name,
    email,
    last_sign_in_at,
    primary_role:roles!profiles_primary_role_id_fkey(id, name)
  `);
```

**Benefits:**

- RLS enforces security at database level
- All data in application tables
- Efficient joins instead of multiple queries
- Scalable (no auth API calls in runtime)
- Clear security boundaries

---

## 🔒 RLS Policy Logic

### How It Works

The policies check if the current user (`auth.uid()`) is a super_admin:

```sql
EXISTS (
  SELECT 1
  FROM profiles current_user
  JOIN roles r ON current_user.primary_role_id = r.id
  WHERE current_user.id = auth.uid()  -- Current logged-in user
  AND r.name = 'super_admin'          -- Has super_admin role
)
```

**Key Points:**

- This does NOT cause infinite recursion because:
  - We're checking a single row by primary key (`current_user.id = auth.uid()`)
  - The lookup is for the current user only, not all profiles
  - PostgreSQL optimizes this to an index scan
- The `roles` table has a separate policy allowing all authenticated users to read (needed for the join)

---

## 📊 Data Flow Comparison

### Old Flow (3 API calls)

```
1. adminClient.from("profiles").select() → Profiles data
2. adminClient.from("user_roles").select() → Role assignments
3. adminClient.auth.admin.listUsers() → Email, last_sign_in_at
4. Merge in JavaScript → Final users array
```

### New Flow (2 queries with joins)

```
1. supabase.from("profiles").select(with joins) → All profile data including email, primary role
2. supabase.from("user_roles").select(with join) → All role assignments
3. Map in JavaScript → Final users array
```

**Performance Improvement:**

- Removed auth API call (expensive)
- Reduced from 3 to 2 database queries
- Better caching (all data in Postgres)
- RLS security enforced

---

## 🔐 When to Use adminClient

`adminClient` should ONLY be used for:

### ✅ Auth Operations (Correct)

```typescript
// Invite user
await adminClient.auth.admin.inviteUser({ email });

// Create user
await adminClient.auth.admin.createUser({ email, password });

// Update user metadata
await adminClient.auth.admin.updateUserById(id, { user_metadata });

// Delete user
await adminClient.auth.admin.deleteUser(id);
```

### ❌ Data Fetching (Incorrect)

```typescript
// NEVER do this in runtime!
await adminClient.from("profiles").select("*");
await adminClient.from("user_roles").select("*");
await adminClient.auth.admin.listUsers(); // Especially this!
```

---

## 🐛 Troubleshooting

### Issue 1: Empty Results After Migration

**Symptom:** Users list is empty despite records existing

**Solution:**

1. Check if RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('profiles', 'user_roles', 'roles');`
2. Verify policies exist: `SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'user_roles', 'roles');`
3. Log out and log back in (refresh JWT)
4. Check browser console for specific errors

### Issue 2: "email column does not exist"

**Symptom:** SQL error about missing email column

**Solution:**
Run Migration 1 first to add the columns before creating users

### Issue 3: Policy "already exists" error

**Symptom:** Can't create policy, already exists

**Solution:**
Use `DROP POLICY IF EXISTS` before `CREATE POLICY` (already in migration file)

### Issue 4: Super admin can't see data

**Symptom:** Super admin user sees empty list

**Possible Causes:**

1. User's `primary_role_id` doesn't point to super_admin role
2. User needs to log out and back in
3. RLS policies not applied correctly

**Check:**

```sql
-- Verify super admin setup
SELECT
  p.id,
  p.email,
  r.name as role_name
FROM profiles p
JOIN roles r ON p.primary_role_id = r.id
WHERE p.id = 'YOUR_USER_ID';
```

---

## 📝 Summary

### Files Changed

- ✅ `supabase/migrations/002_add_email_last_signin_to_profiles.sql` (new)
- ✅ `supabase/migrations/003_rls_policies.sql` (new)
- ✅ `scripts/create-root-admin.ts` (updated)
- ✅ `src/features/settings/users/actions/get-users.actions.ts` (refactored)

### Security Improvements

- ✅ No service role in runtime data fetching
- ✅ RLS enforced at database level
- ✅ Clear separation: adminClient only for auth ops
- ✅ Scalable architecture

### Performance Improvements

- ✅ Removed expensive auth.admin.listUsers() call
- ✅ Reduced API calls from 3 to 2
- ✅ Efficient joins instead of manual merging
- ✅ Better caching (all data in Postgres)

---

## ✅ Verification Checklist

- [ ] Run Migration 1 (add columns)
- [ ] Run Migration 2 (enable RLS and create policies)
- [ ] Update existing profiles with email if needed
- [ ] Recreate super admin with script
- [ ] Log out and log back in
- [ ] Verify users list loads correctly
- [ ] Check that roles display properly
- [ ] Verify regular users can't see all profiles (test RLS)
- [ ] Remove any debug console.logs from production code

---

## 🎉 Result

You now have a secure, scalable user management system that:

- Uses RLS for security
- Stores all data in application tables
- Only uses adminClient for auth operations
- Follows Next.js and Supabase best practices
- Is ready for production
