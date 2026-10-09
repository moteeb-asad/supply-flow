import type { PurchaseOrderStatus } from "@/src/features/purchase-orders/types/domain.types";

export const SKU_RECEIVING_STATUSES = [
  "pending",
  "in_progress",
  "partially_received",
  "received",
  "variance_flagged",
  "overdue",
] as const;

export type SKUReceivingStatus = (typeof SKU_RECEIVING_STATUSES)[number];

// Row of the public.sku_receivings_list view.
export type SkuReceivingItem = {
  id: string;
  purchase_order_id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string | null;
  receipt_datetime: string;
  receiving_location: string;
  status: SKUReceivingStatus;
  sku_count: number;
  qty_ordered: number;
  qty_received: number;
  qty_rejected: number;
  qty_expected: number;
};

// Only POs in these states can have goods received against them.
export const RECEIVABLE_PO_STATUSES = [
  "pending",
  "partially_received",
  "overdue",
] as const satisfies readonly PurchaseOrderStatus[];
