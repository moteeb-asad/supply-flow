import type { QuickTask } from "../types";

// ?create=1 opens the page's create drawer (see useOpenFromQueryParam).
export const QUICK_TASKS: QuickTask[] = [
  {
    label: "Start receiving",
    description: "Check a delivery against its PO",
    icon: "barcode_scanner",
    href: "/sku-receiving?create=1",
    permission: "receiving:create",
  },
  {
    label: "New order",
    description: "Restock low inventory",
    icon: "add_shopping_cart",
    href: "/purchase-orders?create=1",
    permission: "purchase_orders:manage",
  },
  {
    label: "Manage suppliers",
    description: "View and edit supplier details",
    icon: "local_shipping",
    href: "/suppliers",
    permission: "suppliers:view",
  },
  {
    label: "Cycle count",
    description: "Review stock levels",
    icon: "package_2",
    href: "/inventory",
    permission: "inventory:view",
  },
  {
    label: "Generate bill",
    description: "Process pending invoices",
    icon: "receipt_long",
    disabled: true,
  },
];
