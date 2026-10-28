// Every receiving query starts with "sku-receiving", so invalidating
// receivingKeys.all refreshes the receipts table and the metrics together.
export const receivingKeys = {
  all: ["sku-receiving"] as const,
  table: (params: unknown) => ["sku-receiving", "table", params] as const,
  metrics: (dayStart: string) =>
    ["sku-receiving", "metrics", dayStart] as const,
};

// The receiving queue polls so receipts by other users show up without a
// reload. React Query pauses it while the tab is hidden.
export const RECEIVING_REFETCH_INTERVAL_MS = 30_000;
