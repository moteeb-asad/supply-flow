import type { QuickTask } from "../types";

// ?create=1 opens the page's create drawer (see useOpenFromQueryParam).
export const QUICK_TASKS: QuickTask[] = [
  {
    label: "Start Receiving",
    description: "Receive a delivery",
    icon: "barcode_scanner",
    href: "/sku-receiving?create=1",
    permission: "receiving:create",
  },
  {
    label: "New Order",
    description: "Restock low inventory",
    icon: "add_shopping_cart",
    href: "/purchase-orders?create=1",
    permission: "purchase_orders:manage",
  },
  {
    label: "Manage Vendors",
    description: "View and edit suppliers",
    icon: "groups",
    href: "/suppliers",
    permission: "suppliers:view",
  },
  {
    label: "Cycle Count",
    description: "Review stock levels",
    icon: "inventory",
    href: "/inventory",
    permission: "inventory:view",
  },
  {
    label: "Generate Bill",
    description: "Process pending invoices",
    icon: "receipt_long",
    disabled: true,
  },
];
