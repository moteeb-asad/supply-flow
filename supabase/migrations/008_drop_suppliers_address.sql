-- Drop unused address column from suppliers

ALTER TABLE public.suppliers
DROP COLUMN IF EXISTS address;
