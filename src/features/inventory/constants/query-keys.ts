// Every inventory query starts with "inventory", so invalidating
// inventoryKeys.all refreshes everything on the inventory screen.
export const inventoryKeys = {
  all: ["inventory"] as const,
  table: (params: unknown) => ["inventory", "table", params] as const,
};
