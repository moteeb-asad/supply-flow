import {
  OrderDetailsSectionProps,
  PurchaseOrderDrawerMode,
} from "@/src/features/purchase-orders/types";

export default function OrderDetailsSection({
  register,
  errors,
  onPaymentMethodChange,
  mode = "create",
}: OrderDetailsSectionProps & { mode?: PurchaseOrderDrawerMode }) {
  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onPaymentMethodChange?.(event.target.value as "cod" | "card");
  };

  return (
    <section className="space-y-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">
          calendar_today
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted">
          Order Details
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-ink">
            Order Date
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
            {...register("orderDate")}
            name="orderDate"
            type="date"
          />
          {errors?.orderDate ? (
            <p className="text-xs text-red-600">{errors.orderDate.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-ink">
            Expected Delivery
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
            {...register("expectedDeliveryDate")}
            name="expectedDeliveryDate"
            type="date"
          />
          {errors?.expectedDeliveryDate ? (
            <p className="text-xs text-red-600">
              {errors.expectedDeliveryDate.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-ink">
            Shipping Method
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink outline-none transition-all focus:ring-2 focus:ring-primary"
            {...register("shippingMethod")}
            name="shippingMethod"
          >
            <option value="standard">Standard Freight (5-7 days)</option>
            <option value="express">Express Air (1-2 days)</option>
            <option value="economy">Economy Ground (10-14 days)</option>
          </select>
          {errors?.shippingMethod ? (
            <p className="text-xs text-red-600">
              {errors.shippingMethod.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-ink">
            Payment Method
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink outline-none transition-all focus:ring-2 focus:ring-primary"
            {...register("paymentMethod")}
            name="paymentMethod"
            onChange={handlePaymentMethodChange}
          >
            <option value="cod">COD (Cash) - GST 16%</option>
            <option value="card">Card - GST 5%</option>
          </select>
          {errors?.paymentMethod ? (
            <p className="text-xs text-red-600">
              {errors.paymentMethod.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-ink">Status</label>
        <select
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink outline-none transition-all focus:ring-2 focus:ring-primary"
          {...register("status")}
          name="status"
        >
          {mode === "create" ? (
            <>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
            </>
          ) : (
            <>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="partially_received">Partially Received</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
              <option value="overdue">Overdue</option>
            </>
          )}
        </select>
        {errors?.status ? (
          <p className="text-xs text-red-600">{errors.status.message}</p>
        ) : null}
      </div>
    </section>
  );
}
