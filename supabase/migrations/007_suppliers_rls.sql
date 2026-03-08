-- Enable RLS and add policies for suppliers

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suppliers_select"
ON public.suppliers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "suppliers_insert"
ON public.suppliers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "suppliers_update"
ON public.suppliers
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);
