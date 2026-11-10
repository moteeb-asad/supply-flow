// Every purchase order query starts with "purchase-orders", so invalidating
// purchaseOrderKeys.all refreshes the table, metrics and detail together.
// Metric cards poll so changes made by other users show up while the page is
// open; the user's own create/edit/receive refreshes them at once through
// purchaseOrderKeys.all.
export const PURCHASE_ORDER_METRICS_REFETCH_INTERVAL_MS = 60_000;

export const purchaseOrderKeys = {
  all: ["purchase-orders"] as const,
  table: (params: unknown) => ["purchase-orders", "table", params] as const,
  metrics: ["purchase-orders", "metrics"] as const,
  detail: (purchaseOrderId: string) =>
    ["purchase-orders", "detail", purchaseOrderId] as const,
  // POs that can still be received (SKU receiving PO lookup).
  receivable: (search: string) =>
    ["purchase-orders", "receivable", search] as const,
};
