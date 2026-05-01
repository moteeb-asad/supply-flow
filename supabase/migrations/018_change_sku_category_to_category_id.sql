-- 018_change_sku_category_to_category_id.sql
-- Change skus.category from text to category_id (uuid FK)

BEGIN;

-- 1. Add new nullable category_id column
ALTER TABLE public.skus
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

-- 2. (Optional) Migrate existing data if needed (not required if all are NULL)
-- UPDATE public.skus SET category_id = (SELECT id FROM public.categories WHERE name = skus.category) WHERE category IS NOT NULL;

-- 3. Remove old category column
ALTER TABLE public.skus
  DROP COLUMN IF EXISTS category;

COMMIT;
