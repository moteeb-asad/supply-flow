export const sidebarMenu = [
  {
    label: "Dashboard",
    path: "/",
    roles: ["super_admin", "ops_manager", "store_keeper"],
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    roles: ["super_admin", "ops_manager"],
  },
  {
    label: "SKU Receiving",
    path: "/inventory/receive",
    roles: ["store_keeper"],
  },
];
