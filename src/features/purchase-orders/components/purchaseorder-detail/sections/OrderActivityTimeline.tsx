import type { PurchaseOrder } from "@/src/features/purchase-orders/types";
import { formatDateTime } from "@/src/lib/dates";
import type { TimelineEvent } from "@/src/features/purchase-orders/types";
import { getStatus, type StatusTone } from "@/src/components/ui/StatusPill";
import { cn } from "@/src/lib/utils";
import { getReceiptProgress } from "@/src/features/purchase-orders/utils/calculations";

const dotClassName: Record<StatusTone, { ring: string; dot: string }> = {
  success: { ring: "bg-success-soft", dot: "bg-success" },
  primary: { ring: "bg-primary-soft", dot: "bg-primary" },
  warning: { ring: "bg-warning-soft", dot: "bg-warning" },
  danger: { ring: "bg-danger-soft", dot: "bg-danger" },
  neutral: { ring: "bg-neutral-soft", dot: "bg-neutral" },
};

function getReceiptProgressDetails(
  purchaseOrder: PurchaseOrder,
): string | null {
  const totals = getReceiptProgress(purchaseOrder.lineItems);

  if (totals.ordered === 0) {
    return null;
  }

  return `${totals.received} of ${totals.ordered} units received`;
}

function buildTimelineEvents(
  purchaseOrder: PurchaseOrder,
): Array<TimelineEvent & { tone: StatusTone }> {
  const status = getStatus(purchaseOrder.status);
  const receiptDetails = getReceiptProgressDetails(purchaseOrder);

  const events: Array<TimelineEvent & { tone: StatusTone }> = [
    {
      id: "status",
      label: status.label,
      tone: status.tone,
      timestamp: formatDateTime(purchaseOrder.expected_delivery_date),
      details: receiptDetails ?? undefined,
    },
    {
      id: "sent-to-supplier",
      label: "Sent to supplier",
      tone: "neutral",
      timestamp: formatDateTime(purchaseOrder.order_date),
    },
    {
      id: "created",
      label: "Created",
      tone: "neutral",
      timestamp: formatDateTime(purchaseOrder.order_date),
      details: `Created for ${purchaseOrder.supplier_name}`,
    },
  ];

  if (purchaseOrder.status !== "closed") {
    events.push({
      id: "closed",
      label: "Closed",
      tone: "neutral",
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
    <section
      aria-labelledby="po-activity-title"
      className="rounded-card border border-line p-5"
    >
      <h2 id="po-activity-title" className="text-[15px] font-semibold">
        Activity
      </h2>

      <ol className="mt-4 space-y-4">
        {events.map((event) => (
          <li
            key={event.id}
            className={cn(
              "relative flex gap-3",
              event.isPending && "opacity-50",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full",
                dotClassName[event.tone].ring,
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  dotClassName[event.tone].dot,
                )}
              />
            </span>
            <div>
              <p className="text-[13px] font-medium">{event.label}</p>
              <p className="text-xs text-subtle">{event.timestamp}</p>
              {event.details ? (
                <p className="mt-1 text-[13px] text-muted">{event.details}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
