import type { Role, Permission } from "../types";

export const ROLES = [
  "super_admin",
  "operations_manager",
  "store_keeper",
] as const;

export const PERMISSIONS = [
  "dashboard:view",
  "inventory:view",
  "inventory:manage",
  "suppliers:view",
  "suppliers:manage",
  "purchase_orders:view",
  "purchase_orders:manage",
  "reports:view",
  "receiving:view",
  "receiving:create",
  "settings:view",
  "users:manage",
] as const;

// Record<Role, ...> forces every role to be listed; Permission[] rejects typos.
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  super_admin: PERMISSIONS,
  operations_manager: PERMISSIONS.filter((p) => p !== "users:manage"),
  store_keeper: [
    "dashboard:view",
    "inventory:view",
    "receiving:view",
    "receiving:create",
    "settings:view",
  ],
};

// Moved here from types.ts (it's a runtime value, not a type).
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  operations_manager: "Operations Manager",
  store_keeper: "Store Keeper",
};
