-- Add payment_method to purchase_orders for GST calculation rules.
-- COD => 16% GST, CARD => 5% GST.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'purchase_order_payment_method'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.purchase_order_payment_method AS ENUM (
      'cod',
      'card'
    );
  END IF;
END
$$;

ALTER TABLE public.purchase_orders
ADD COLUMN IF NOT EXISTS payment_method public.purchase_order_payment_method NOT NULL DEFAULT 'cod';
