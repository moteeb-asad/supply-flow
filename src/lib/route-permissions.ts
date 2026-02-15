export const routePermissions: Record<string, string[]> = {
  "/dashboard": ["super_admin", "ops_manager", "store_keeper"],
  "/suppliers": ["super_admin", "ops_manager"],
  "/inventory/receive": ["store_keeper"],
  "/reports": ["super_admin", "ops_manager"],
  "/settings": ["super_admin", "ops_manager", "store_keeper"],
  "/settings/account": ["super_admin", "ops_manager", "store_keeper"],
  "/settings/user-management": ["super_admin"],
};
