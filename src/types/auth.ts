export type UserRole = "super_admin" | "operations_manager" | "store_keeper";

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Admin",
  operations_manager: "Operations Manager",
  store_keeper: "Store Keeper",
};
