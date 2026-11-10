// Every supplier query starts with "suppliers", so invalidating
// supplierKeys.all refreshes the grid, the detail page and the supplier
// pickers in the PO and inventory forms together.
export const supplierKeys = {
  all: ["suppliers"] as const,
  list: (filters: unknown) => ["suppliers", "list", filters] as const,
  detail: (supplierId: string) => ["suppliers", "detail", supplierId] as const,
  picker: (search: string) => ["suppliers", "picker", search] as const,
  metrics: ["suppliers", "metrics"] as const,
};

// Metric cards poll so new deliveries and orders show up while the page is
// open; adding or editing a supplier refreshes them at once through
// supplierKeys.all.
export const SUPPLIER_METRICS_REFETCH_INTERVAL_MS = 60_000;
