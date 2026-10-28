// Every purchase order query starts with "purchase-orders", so invalidating
// purchaseOrderKeys.all refreshes the table, metrics and detail together.
export const purchaseOrderKeys = {
  all: ["purchase-orders"] as const,
  table: (params: unknown) => ["purchase-orders", "table", params] as const,
  metrics: ["purchase-orders", "metrics"] as const,
  detail: (purchaseOrderId: string) =>
    ["purchase-orders", "detail", purchaseOrderId] as const,
};
