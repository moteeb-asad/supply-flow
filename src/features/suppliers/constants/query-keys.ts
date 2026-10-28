// Every supplier query starts with "suppliers", so invalidating
// supplierKeys.all refreshes the grid, the detail page and the supplier
// pickers in the PO and inventory forms together.
export const supplierKeys = {
  all: ["suppliers"] as const,
  list: (filters: unknown) => ["suppliers", "list", filters] as const,
  detail: (supplierId: string) => ["suppliers", "detail", supplierId] as const,
  picker: (search: string) => ["suppliers", "picker", search] as const,
};
