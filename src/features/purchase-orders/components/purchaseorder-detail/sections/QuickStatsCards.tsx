import type { PurchaseOrder } from "../../../types";
import { formatPurchaseOrderAmount } from "@/src/features/purchase-orders/utils/formatters";
import { formatDate } from "@/src/lib/dates";

type QuickStatsCardsProps = {
  purchaseOrder: PurchaseOrder;
};

const paymentMethodLabel: Record<PurchaseOrder["payment_method"], string> = {
  cod: "COD (Cash)",
  card: "Card",
};

const gstLabel: Record<PurchaseOrder["payment_method"], string> = {
  cod: "GST 16%",
  card: "GST 5%",
};

// One summary strip with hairline dividers (the gap shows the line colour).
export default function QuickStatsCards({
  purchaseOrder,
}: QuickStatsCardsProps) {
  const stats: Array<{ label: string; value: React.ReactNode }> = [
    { label: "Supplier", value: purchaseOrder.supplier_name },
    { label: "Order date", value: formatDate(purchaseOrder.order_date) },
    {
      label: "Expected delivery",
      value: formatDate(purchaseOrder.expected_delivery_date),
    },
    {
      label: "Total amount",
      value: (
        <span className="tabular-nums">
          {formatPurchaseOrderAmount(purchaseOrder.total_amount)}
        </span>
      ),
    },
    {
      label: "Payment",
      value: (
        <>
          {paymentMethodLabel[purchaseOrder.payment_method]}{" "}
          <span className="text-[13px] font-normal text-subtle">
            {gstLabel[purchaseOrder.payment_method]}
          </span>
        </>
      ),
    },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-5 sm:[&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
      {stats.map((stat) => (
        <div key={stat.label} className="min-w-0 bg-surface p-4">
          <dt className="text-[13px] text-muted">{stat.label}</dt>
          <dd className="mt-1 truncate text-[15px] font-medium">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
