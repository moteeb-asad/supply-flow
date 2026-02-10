export type UserRole = "super_admin" | "ops_manager" | "store_keeper";

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  ops_manager: "Operations Manager",
  store_keeper: "Store Keeper",
};
