-- Create suppliers table

CREATE TABLE IF NOT EXISTS public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  status text DEFAULT 'active',
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  address text,
  payment_terms text,
  min_order_qty integer,
  lead_time_days integer,
  notes text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS suppliers_name_idx ON public.suppliers (name);
CREATE INDEX IF NOT EXISTS suppliers_created_by_idx ON public.suppliers (created_by);
