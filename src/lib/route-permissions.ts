// src/lib/route-permissions.ts
export type UserRole = "super_admin" | "ops_manager" | "store_keeper";

export const routePermissions: Record<string, UserRole[]> = {
  "/suppliers": ["super_admin", "ops_manager"],
  "/inventory": ["super_admin", "ops_manager", "store_keeper"],
  "/reports": ["super_admin"],
};
