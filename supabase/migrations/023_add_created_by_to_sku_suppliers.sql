-- Migration: Add created_by column to sku_suppliers table
-- Adds a reference to the user who created the supplier-SKU link

ALTER TABLE public.sku_suppliers
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Optionally, you may want to backfill this column for existing rows if needed.
-- UPDATE public.sku_suppliers SET created_by = NULL WHERE created_by IS NULL;
