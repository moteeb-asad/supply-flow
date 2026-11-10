// Every inventory query starts with "inventory", so invalidating
// inventoryKeys.all refreshes everything on the inventory screen.
export const inventoryKeys = {
  all: ["inventory"] as const,
  table: (params: unknown) => ["inventory", "table", params] as const,
  metrics: ["inventory", "metrics"] as const,
};

// Metric cards poll so stock changes made by other users show up while the
// page is open; the user's own add item / receiving refreshes them at once
// through inventoryKeys.all.
export const INVENTORY_METRICS_REFETCH_INTERVAL_MS = 60_000;
