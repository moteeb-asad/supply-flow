"use client";

import { cn } from "@/src/lib/utils";
import type { PurchaseOrderStatus } from "../../types";

const STATUS_TABS: Array<{
  key: PurchaseOrderStatus | undefined;
  label: string;
}> = [
  { key: undefined, label: "All orders" },
  { key: "draft", label: "Draft" },
  { key: "pending", label: "Pending" },
  { key: "partially_received", label: "Partially received" },
  { key: "closed", label: "Closed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "overdue", label: "Overdue" },
];

export default function PurchaseOrdersStatusTabs({
  status,
  onStatusChange,
}: {
  status?: PurchaseOrderStatus;
  onStatusChange: (status?: PurchaseOrderStatus) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter by status"
      className="flex min-w-max gap-6"
    >
      {STATUS_TABS.map((tab) => {
        const isActive = status === tab.key || (!status && !tab.key);
        return (
          <button
            key={tab.key ?? "all"}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
              "-mb-px h-11 cursor-pointer border-b-2 text-[13px] font-medium",
              isActive
                ? "border-ink text-ink"
                : "border-transparent text-muted hover:text-ink",
            )}
            onClick={() => {
              onStatusChange(tab.key);
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
