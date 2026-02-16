export const routePermissions: Record<string, string[]> = {
  "/dashboard": ["super_admin", "operations_manager", "store_keeper"],
  "/suppliers": ["super_admin", "operations_manager"],
  "/inventory/receive": ["store_keeper"],
  "/reports": ["super_admin", "operations_manager"],
  "/settings": ["super_admin", "operations_manager", "store_keeper"],
  "/settings/account": ["super_admin", "operations_manager", "store_keeper"],
  "/settings/user-management": ["super_admin"],
};
