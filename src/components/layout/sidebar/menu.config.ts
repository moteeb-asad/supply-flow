import type { SidebarMenuGroup, SidebarMenuItem } from "@/src/types/navigation";

// Group order and headings in the sidebar.
export const sidebarGroups: { id: SidebarMenuGroup; label: string }[] = [
  { id: "operations", label: "Operations" },
  { id: "partners", label: "Partners" },
  { id: "insights", label: "Insights" },
];

export const sidebarMenu: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
    permission: "dashboard:view",
    group: "operations",
  },
  {
    label: "Purchase orders",
    path: "/purchase-orders",
    icon: "purchaseOrders",
    permission: "purchase_orders:view",
    group: "operations",
  },
  {
    label: "SKU receiving",
    path: "/sku-receiving",
    icon: "receiving",
    permission: "receiving:view",
    group: "operations",
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: "inventory",
    permission: "inventory:view",
    group: "operations",
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: "suppliers",
    permission: "suppliers:view",
    group: "partners",
  },
  {
    label: "Reports",
    path: "/reports",
    icon: "reports",
    permission: "reports:view",
    group: "insights",
    badge: "Soon",
  },
];
