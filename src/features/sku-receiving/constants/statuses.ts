import type { PurchaseOrderStatus } from "@/src/features/purchase-orders/types/domain.types";

export const SKU_RECEIVING_STATUSES = [
  "pending",
  "in_progress",
  "partially_received",
  "received",
  "variance_flagged",
  "overdue",
] as const;

// Only POs in these states can have goods received against them.
export const RECEIVABLE_PO_STATUSES = [
  "pending",
  "partially_received",
  "overdue",
] as const satisfies readonly PurchaseOrderStatus[];
