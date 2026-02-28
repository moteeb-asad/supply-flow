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

-- Drop function if exists
DROP FUNCTION IF EXISTS is_super_admin();

-- =====================================================================
-- SECURITY ARCHITECTURE DECISION:
-- 
-- Admin features (like user management) use adminClient with explicit
-- server-side permission checks (via JWT metadata) instead of RLS policies.
-- 
-- WHY?
-- - RLS policies that check "is user super_admin?" create infinite recursion
-- - Checking JWT metadata is non-recursive and more performant
-- - Admin features are isolated server actions, not general user features
-- 
-- These policies protect REGULAR USER features only.
-- Admin features verify permissions in application code before using adminClient.
-- =====================================================================

-- =====================================================================
-- ROLES TABLE: Allow all reads (reference data, no sensitive info)
-- =====================================================================
CREATE POLICY "All users can read roles"
ON roles FOR SELECT
USING (true);

-- =====================================================================
-- PROFILES TABLE: Users can only read their own profile
-- =====================================================================
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (id = auth.uid());

-- =====================================================================
-- USER_ROLES TABLE: Users can only read their own roles
-- =====================================================================
CREATE POLICY "Users can read own roles"
ON user_roles FOR SELECT
USING (user_id = auth.uid());
