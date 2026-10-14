import type { SidebarMenuItem } from "@/src/types/navigation";

export const sidebarMenu: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
    permission: "dashboard:view",
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: "local_shipping",
    permission: "suppliers:view",
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: "package_2",
    permission: "inventory:view",
  },
  {
    label: "Purchase Orders",
    path: "/purchase-orders",
    icon: "description",
    permission: "purchase_orders:view",
  },
  {
    label: "Reports",
    path: "/reports",
    icon: "analytics",
    permission: "reports:view",
  },
  {
    label: "SKU Receiving",
    path: "/sku-receiving",
    icon: "inventory_2",
    permission: "receiving:view",
  },
];
