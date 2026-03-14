"use client";

import Link from "next/link";
import type {
  PurchaseOrderStatus,
  PurchaseOrderHeaderProps,
} from "../../../types/purchase-orders.types";

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

export default function PurchaseOrderHeader({
  purchaseOrder,
  onEditClick,
}: PurchaseOrderHeaderProps) {
  const status = statusConfig[purchaseOrder.status] ?? statusConfig.draft;
  const poLabel = `#${purchaseOrder.po_number}`;

  return (
    <>
      <div className="max-w-7xl mx-auto px-8 2xl:px-0">
        <div className=" pt-6">
          <div className="flex items-center gap-2 text-sm">
            <Link
              className="text-[#4e6797] dark:text-slate-400 font-medium hover:text-primary transition-colors"
              href="/purchase-orders"
            >
              Purchase Orders
            </Link>
            <span className="text-[#4e6797] dark:text-slate-500">/</span>
            <span className="text-[#0e121b] dark:text-white font-medium">
              {poLabel}
            </span>
          </div>
        </div>
        <div className=" py-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h2 className="text-[#0e121b] dark:text-white text-4xl font-black leading-tight tracking-tight">
                  {poLabel}
                </h2>
                <span
                  className={`${status.className} text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}
                >
                  {status.label}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="disabled:opacity-50 disabled:cursor-not-allowed w-full py-3.5 shadow-primary/20 flex items-center justify-center gap-2 rounded-lg shadow-none h-10 px-4 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 text-[#0e121b] dark:text-white text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">
                  download
                </span>
                <span className="text-nowrap">Download PDF</span>
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onEditClick?.();
                }}
                className="disabled:opacity-50 disabled:cursor-not-allowed border border-transparent w-full py-3.5 shadow-primary/20 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                <span>Edit PO</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
