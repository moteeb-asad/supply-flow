export const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/suppliers": "Supplier Management",
  "/inventory": "Inventory Overview",
  "/inventory/receive": "SKU Receiving",
  "/reports": "Reports & Analytics",
  "/settings": "Settings",
  "/settings/users": "User Management",
  "/settings/account": "Account Information",
};

export function getPageTitle(pathname: string): string {
  return pageTitles[pathname] || "SupplyFlow";
}
