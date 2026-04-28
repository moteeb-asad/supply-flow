-- 017_create_categories.sql
-- Create categories table and RLS policy (Super Admin only)

BEGIN;

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow super_admin insert" ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.primary_role_id = 1 -- 1 = super_admin
    )
  );

-- Policy: Only super_admin can update
CREATE POLICY "Allow super_admin update" ON public.categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.primary_role_id = 1
    )
  );

-- Policy: Only super_admin can delete
CREATE POLICY "Allow super_admin delete" ON public.categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.primary_role_id = 1
    )
  );

-- Policy: Anyone authenticated can SELECT (optional, restrict if needed)
CREATE POLICY "Allow all select" ON public.categories
  FOR SELECT
  TO authenticated
  USING (true);

COMMIT;
