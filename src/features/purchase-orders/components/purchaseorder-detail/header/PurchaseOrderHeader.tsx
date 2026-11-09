"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import AppIcon from "@/src/components/ui/AppIcon";
import { StatusPill } from "@/src/components/ui/StatusPill";
import type { PurchaseOrderHeaderProps } from "../../../types";
import { getReceiptProgress } from "../../../utils/calculations";
import { formatQuantity } from "../../../utils/formatters";

export default function PurchaseOrderHeader({
  purchaseOrder,
  onEditClick,
}: PurchaseOrderHeaderProps) {
  const { received, ordered } = getReceiptProgress(purchaseOrder.lineItems);
  const receiptSummary =
    ordered === 0
      ? ""
      : received >= ordered
        ? ` All ${formatQuantity(ordered)} units received.`
        : ` ${formatQuantity(received)} of ${formatQuantity(ordered)} units received.`;

  return (
    <header className="px-8 pb-6 pt-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[13px]"
      >
        <Link className="text-muted hover:text-ink" href="/purchase-orders">
          Purchase orders
        </Link>
        <AppIcon name="chevronRight" className="size-3.5 text-subtle" />
        <span
          aria-current="page"
          className="truncate font-mono text-[12.5px] text-ink"
        >
          {purchaseOrder.po_number}
        </span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate font-mono text-[22px] font-medium tracking-[-0.01em]">
              {purchaseOrder.po_number}
            </h1>
            <StatusPill status={purchaseOrder.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {purchaseOrder.supplier_name}.{receiptSummary}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="md" disabled>
            <AppIcon name="download" className="size-4 text-subtle" />
            Download PDF
          </Button>
          <Button
            size="md"
            onClick={(event) => {
              event.preventDefault();
              onEditClick?.();
            }}
          >
            <AppIcon name="edit" className="size-4" />
            Edit order
          </Button>
        </div>
      </div>
    </header>
  );
}
