import { OrderDetailsSectionProps } from "@/src/features/purchase-orders/types/purchase-orders.types";

export default function OrderDetailsSection({
  orderDate,
  expectedDeliveryDate,
  shippingMethod,
  status,
  errors,
}: OrderDetailsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined !text-[20px]">
          calendar_today
        </span>
        <h3 className="font-semibold text-sm uppercase tracking-wider">
          Order Details
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Order Date
          </label>
          <input
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            defaultValue={orderDate || ""}
            name="orderDate"
            type="date"
          />
          {errors?.orderDate ? (
            <p className="text-xs text-red-600 dark:text-red-400">
              {errors.orderDate}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Expected Delivery
          </label>
          <input
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            defaultValue={expectedDeliveryDate || ""}
            name="expectedDeliveryDate"
            type="date"
          />
          {errors?.expectedDeliveryDate ? (
            <p className="text-xs text-red-600 dark:text-red-400">
              {errors.expectedDeliveryDate}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Shipping Method
        </label>
        <select
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          defaultValue={shippingMethod || "standard"}
          name="shippingMethod"
        >
          <option value="standard">Standard Freight (5-7 days)</option>
          <option value="express">Express Air (1-2 days)</option>
          <option value="economy">Economy Ground (10-14 days)</option>
        </select>
        {errors?.shippingMethod ? (
          <p className="text-xs text-red-600 dark:text-red-400">
            {errors.shippingMethod}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Status
        </label>
        <select
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          defaultValue={status || "draft"}
          name="status"
        >
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
        </select>
        {errors?.status ? (
          <p className="text-xs text-red-600 dark:text-red-400">
            {errors.status}
          </p>
        ) : null}
      </div>
    </section>
  );
}
