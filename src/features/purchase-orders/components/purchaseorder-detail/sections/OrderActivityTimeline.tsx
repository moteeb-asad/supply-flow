import type { PurchaseOrder } from "@/src/features/purchase-orders/types";
import { formatDateTime } from "@/src/features/purchase-orders/utils/formatters";
import type { TimelineEvent } from "@/src/features/purchase-orders/types";

const statusLabels: Record<PurchaseOrder["status"], string> = {
  draft: "Draft",
  pending: "Pending",
  partially_received: "Partially Received",
  closed: "Closed",
  cancelled: "Cancelled",
  overdue: "Overdue",
};

function getReceiptProgressDetails(
  purchaseOrder: PurchaseOrder,
): string | null {
  if (!purchaseOrder.lineItems?.length) {
    return null;
  }

  const totals = purchaseOrder.lineItems.reduce(
    (acc, item) => {
      acc.received += item.received_qty;
      acc.ordered += item.ordered_qty;
      return acc;
    },
    { received: 0, ordered: 0 },
  );

  if (totals.ordered === 0) {
    return null;
  }

  return `${totals.received}/${totals.ordered} units received`;
}

function buildTimelineEvents(purchaseOrder: PurchaseOrder): TimelineEvent[] {
  const statusLabel = statusLabels[purchaseOrder.status];
  const receiptDetails = getReceiptProgressDetails(purchaseOrder);

  const events: TimelineEvent[] = [
    {
      id: "status",
      label: statusLabel,
      timestamp: formatDateTime(purchaseOrder.expected_delivery_date),
      details: receiptDetails ?? undefined,
    },
    {
      id: "sent-to-supplier",
      label: "Sent to Supplier",
      timestamp: formatDateTime(purchaseOrder.order_date),
    },
    {
      id: "created",
      label: "Created",
      timestamp: formatDateTime(purchaseOrder.order_date),
      details: `PO #${purchaseOrder.po_number} created for ${purchaseOrder.supplier_name}`,
    },
  ];

  if (purchaseOrder.status !== "closed") {
    events.push({
      id: "closed",
      label: "Closed",
      timestamp: "Pending full receipt",
      isPending: true,
    });
  }

  return events;
}

export default function OrderActivityTimeline({
  purchaseOrder,
}: {
  purchaseOrder: PurchaseOrder;
}) {
  const events = buildTimelineEvents(purchaseOrder);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-base font-bold">Order Activity Timeline</h3>

      <div className="relative space-y-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-[2px] before:bg-slate-200 before:content-['']">
        {events.map((event) => (
          <div
            key={event.id}
            className={`relative pl-8 ${event.isPending ? "opacity-40" : ""}`}
          >
            <div
              className={`absolute left-0 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 ${
                event.isPending
                  ? "border-background-light bg-slate-200"
                  : "border-background-light bg-primary"
              }`}
            ></div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {event.label}
              </p>
              <p className="text-xs text-slate-500">
                {event.timestamp}
              </p>
              {event.details ? (
                <p className="mt-1 text-xs text-slate-600">
                  {event.details}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
