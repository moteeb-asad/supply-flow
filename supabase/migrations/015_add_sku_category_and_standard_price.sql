-- Add SKU category and standard reference unit price.

BEGIN;

ALTER TABLE public.skus
  ADD COLUMN IF NOT EXISTS category text;

ALTER TABLE public.skus
  ADD COLUMN IF NOT EXISTS standard_unit_price numeric(14,2) NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'skus_standard_unit_price_non_negative'
  ) THEN
    ALTER TABLE public.skus
      ADD CONSTRAINT skus_standard_unit_price_non_negative
      CHECK (standard_unit_price >= 0);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS skus_category_idx
  ON public.skus (category);

COMMIT;
