-- Add computed stock status for scalable inventory filtering.
-- Thresholds:
--   critical: on_hand_qty <= 20
--   low:      on_hand_qty <= 50
--   good:     on_hand_qty > 50

ALTER TABLE public.inventory_stock
ADD COLUMN IF NOT EXISTS stock_status text
GENERATED ALWAYS AS (
  CASE
    WHEN on_hand_qty <= 20 THEN 'critical'
    WHEN on_hand_qty <= 50 THEN 'low'
    ELSE 'good'
  END
) STORED;

-- Optional explicit constraint for clarity and safety.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'inventory_stock_status_check'
      AND conrelid = 'public.inventory_stock'::regclass
  ) THEN
    ALTER TABLE public.inventory_stock
    ADD CONSTRAINT inventory_stock_status_check
    CHECK (stock_status IN ('good', 'low', 'critical'));
  END IF;
END $$;

-- Index for fast stock-status filtering in list queries.
CREATE INDEX IF NOT EXISTS idx_inventory_stock_stock_status
ON public.inventory_stock (stock_status);
