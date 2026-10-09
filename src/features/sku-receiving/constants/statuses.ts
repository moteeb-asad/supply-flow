import type { PurchaseOrderStatus } from "@/src/features/purchase-orders/types/domain.types";
import type { SKUReceivingStatus } from "../types";

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

export const SKU_RECEIVING_STATUS_STYLES: Record<
  SKUReceivingStatus,
  { label: string; className: string; dotClass: string }
> = {
  in_progress: {
    label: "In Progress",
    className: "bg-red-100 text-red-700",
    dotClass: "bg-red-600",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700",
    dotClass: "bg-amber-600",
  },
  partially_received: {
    label: "Partially Received",
    className: "bg-blue-100 text-blue-700",
    dotClass: "bg-blue-600",
  },
  received: {
    label: "Received",
    className: "bg-green-100 text-green-700",
    dotClass: "bg-green-600",
  },
  variance_flagged: {
    label: "Variance Flagged",
    className: "bg-rose-100 text-rose-700",
    dotClass: "bg-rose-600",
  },
  overdue: {
    label: "Overdue",
    className: "bg-slate-100 text-slate-700",
    dotClass: "bg-slate-500",
  },
};
