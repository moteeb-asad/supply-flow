-- Create core purchase order tables
-- Links required by product flow:
-- - purchase_orders.supplier_id -> suppliers.id
-- - purchase_orders.created_by -> profiles.id
-- - purchase_order_items.sku_id -> skus.id

-- Create enum for purchase order lifecycle
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'purchase_order_status'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.purchase_order_status AS ENUM (
      'draft',
      'pending',
      'partially_received',
      'closed',
      'cancelled',
      'overdue'
    );
  END IF;
END
$$;

-- Minimal SKU catalog table (created because no SKU table exists yet)
CREATE TABLE IF NOT EXISTS public.skus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_code text NOT NULL UNIQUE,
  name text NOT NULL,
  unit text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS skus_name_idx ON public.skus (name);
CREATE INDEX IF NOT EXISTS skus_created_by_idx ON public.skus (created_by);

-- Purchase order header
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number text NOT NULL UNIQUE,
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  approved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status public.purchase_order_status NOT NULL DEFAULT 'draft',
  order_date date NOT NULL DEFAULT current_date,
  expected_delivery_date date,
  sent_at timestamptz,
  currency text NOT NULL DEFAULT 'USD',
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  tax_amount numeric(14,2) NOT NULL DEFAULT 0,
  total_amount numeric(14,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS purchase_orders_supplier_id_idx
  ON public.purchase_orders (supplier_id);
CREATE INDEX IF NOT EXISTS purchase_orders_created_by_idx
  ON public.purchase_orders (created_by);
CREATE INDEX IF NOT EXISTS purchase_orders_status_idx
  ON public.purchase_orders (status);
CREATE INDEX IF NOT EXISTS purchase_orders_order_date_idx
  ON public.purchase_orders (order_date DESC);

-- Purchase order line items
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  sku_id uuid NOT NULL REFERENCES public.skus(id) ON DELETE RESTRICT,
  ordered_qty numeric(12,2) NOT NULL CHECK (ordered_qty > 0),
  received_qty numeric(12,2) NOT NULL DEFAULT 0 CHECK (received_qty >= 0),
  unit_price numeric(14,2) NOT NULL CHECK (unit_price >= 0),
  line_total numeric(14,2) GENERATED ALWAYS AS (ordered_qty * unit_price) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT purchase_order_items_unique_po_sku UNIQUE (purchase_order_id, sku_id)
);

CREATE INDEX IF NOT EXISTS purchase_order_items_po_id_idx
  ON public.purchase_order_items (purchase_order_id);
CREATE INDEX IF NOT EXISTS purchase_order_items_sku_id_idx
  ON public.purchase_order_items (sku_id);
