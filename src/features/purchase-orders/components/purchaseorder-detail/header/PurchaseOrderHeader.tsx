"use client";

import Link from "next/link";
import type {
  PurchaseOrderStatus,
  PurchaseOrderHeaderProps,
} from "../../../types";

const statusConfig: Record<
  PurchaseOrderStatus,
  { label: string; className: string }
> = {
  closed: { label: "Closed", className: "bg-green-100 text-green-700" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  partially_received: {
    label: "Partially Received",
    className: "bg-blue-100 text-blue-700",
  },
  draft: { label: "Draft", className: "bg-slate-100 text-slate-700" },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-700",
  },
};

const actionButtonClassName =
  "flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export default function PurchaseOrderHeader({
  purchaseOrder,
  onEditClick,
}: PurchaseOrderHeaderProps) {
  const status = statusConfig[purchaseOrder.status] ?? statusConfig.draft;
  const poLabel = `#${purchaseOrder.po_number}`;

  return (
    <div className="px-6 pb-4 pt-5">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            className="font-medium text-muted transition-colors hover:text-primary"
            href="/purchase-orders"
          >
            Purchase Orders
          </Link>
          <span className="text-muted">/</span>
          <span className="truncate font-medium text-ink">{poLabel}</span>
        </nav>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h2 className="truncate text-2xl font-bold tracking-tight text-ink">
              {poLabel}
            </h2>
            <span
              className={`${status.className} rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider`}
            >
              {status.label}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className={`${actionButtonClassName} border border-line bg-white text-ink hover:bg-slate-50`}
              disabled
              type="button"
            >
              <span className="material-symbols-outlined !text-[18px]">
                download
              </span>
              <span className="text-nowrap">Download PDF</span>
            </button>
            <button
              className={`${actionButtonClassName} border border-transparent bg-primary text-white shadow-md hover:bg-blue-700`}
              onClick={(event) => {
                event.preventDefault();
                onEditClick?.();
              }}
              type="button"
            >
              <span className="material-symbols-outlined !text-[18px]">edit</span>
              <span>Edit PO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
