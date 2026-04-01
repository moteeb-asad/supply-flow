import type { SidebarMenuItem } from "@/src/types/navigation";

export const sidebarMenu: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
    roles: ["super_admin", "operations_manager", "store_keeper"],
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: "local_shipping",
    roles: ["super_admin", "operations_manager"],
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: "package_2",
    roles: ["super_admin", "operations_manager", "store_keeper"],
  },
  {
    label: "Purchase Orders",
    path: "/purchase-orders",
    icon: "package_2",
    roles: ["super_admin", "operations_manager"],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: "analytics",
    roles: ["super_admin", "operations_manager"],
  },
  {
    label: "SKU Receiving",
    path: "/inventory/receive",
    icon: "inventory_2",
    roles: ["store_keeper"],
  },
];
