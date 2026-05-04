-- Remove problematic roles policy that can cause recursive role reads.
-- Safe to run multiple times.
DROP POLICY IF EXISTS "Super admins can read all roles" ON public.roles;
