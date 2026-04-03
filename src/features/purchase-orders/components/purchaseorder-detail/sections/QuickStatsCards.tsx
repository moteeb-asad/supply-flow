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

export default function QuickStatsCards({
  purchaseOrder,
}: QuickStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">
          Supplier
        </p>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">store</span>
          <p className="text-lg font-bold text-slate-900">
            {purchaseOrder.supplier_name}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">
          Order Date
        </p>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            calendar_today
          </span>
          <p className="text-lg font-bold text-slate-900">
            {formatPurchaseOrderDate(purchaseOrder.order_date)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">
          Expected Delivery
        </p>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            event_upcoming
          </span>
          <p className="text-lg font-bold text-slate-900">
            {formatPurchaseOrderDate(purchaseOrder.expected_delivery_date)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-l-4 border-l-primary border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">
          Total Amount
        </p>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            payments
          </span>
          <p className="text-lg font-black text-slate-900">
            {formatPurchaseOrderAmount(purchaseOrder.total_amount)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">
          Payment Method
        </p>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            credit_card
          </span>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {paymentMethodLabel[purchaseOrder.payment_method]}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {gstLabel[purchaseOrder.payment_method]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
