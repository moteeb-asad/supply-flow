import { StatCard } from "@/src/components/ui/StatCard";
import type { PurchaseOrder } from "../../../types";
import {
  formatPurchaseOrderAmount,
  formatPurchaseOrderDate,
} from "@/src/features/purchase-orders/utils/formatters";

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

const cardProps = {
  className: "border-slate-200 shadow-sm",
  labelClassName: "text-slate-500",
  valueClassName: "max-w-full truncate text-base text-slate-900",
};

export default function QuickStatsCards({
  purchaseOrder,
}: QuickStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        {...cardProps}
        label="Supplier"
        icon="store"
        value={purchaseOrder.supplier_name}
      />
      <StatCard
        {...cardProps}
        label="Order Date"
        icon="calendar_today"
        value={formatPurchaseOrderDate(purchaseOrder.order_date)}
      />
      <StatCard
        {...cardProps}
        label="Expected Delivery"
        icon="event_upcoming"
        value={formatPurchaseOrderDate(purchaseOrder.expected_delivery_date)}
      />
      <StatCard
        {...cardProps}
        className="border-l-4 border-slate-200 border-l-primary shadow-sm"
        valueClassName="max-w-full truncate text-base font-black text-slate-900"
        label="Total Amount"
        icon="payments"
        value={formatPurchaseOrderAmount(purchaseOrder.total_amount)}
      />
      <StatCard
        {...cardProps}
        label="Payment Method"
        icon="credit_card"
        value={paymentMethodLabel[purchaseOrder.payment_method]}
        hint={
          <span className="text-xs font-semibold text-slate-500">
            {gstLabel[purchaseOrder.payment_method]}
          </span>
        }
      />
    </div>
  );
}
