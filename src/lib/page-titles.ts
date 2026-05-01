const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/suppliers": "Supplier Management",
  "/inventory": "Inventory Overview",
  "/sku-receiving": "SKU Receiving",
  "/reports": "Reports & Analytics",
  "/settings": "Settings",
  "/settings/user-management": "User Management",
  "/settings/user-management/users": "User Management",
  "/settings/user-management/invitations": "User Management",
  "/settings/account": "Account Information",
};

export function getPageTitle(pathname: string): string {
  return pageTitles[pathname] || "SupplyFlow";
}
