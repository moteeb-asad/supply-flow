import {
  OrderDetailsSectionProps,
  PurchaseOrderDrawerMode,
} from "@/src/features/purchase-orders/types";
import { cn } from "@/src/lib/utils";
import {
  errorClassName,
  fieldClassName,
  labelClassName,
  sectionHeadingClassName,
} from "./fields";

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
    <section
      aria-labelledby="po-details"
      className="space-y-3 border-t border-line-soft pt-6"
    >
      <h3 id="po-details" className={sectionHeadingClassName}>
        Order details
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="po-order-date" className={labelClassName}>
            Order date
          </label>
          <input
            id="po-order-date"
            className={fieldClassName}
            aria-invalid={errors?.orderDate ? true : undefined}
            {...register("orderDate")}
            name="orderDate"
            type="date"
          />
          {errors?.orderDate ? (
            <p className={errorClassName}>{errors.orderDate.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="po-expected-delivery" className={labelClassName}>
            Expected delivery
          </label>
          <input
            id="po-expected-delivery"
            className={fieldClassName}
            aria-invalid={errors?.expectedDeliveryDate ? true : undefined}
            {...register("expectedDeliveryDate")}
            name="expectedDeliveryDate"
            type="date"
          />
          {errors?.expectedDeliveryDate ? (
            <p className={errorClassName}>
              {errors.expectedDeliveryDate.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="po-shipping-method" className={labelClassName}>
            Shipping method
          </label>
          <select
            id="po-shipping-method"
            className={cn(fieldClassName, "cursor-pointer")}
            aria-invalid={errors?.shippingMethod ? true : undefined}
            {...register("shippingMethod")}
            name="shippingMethod"
          >
            <option value="standard">Standard freight, 5–7 days</option>
            <option value="express">Express air, 1–2 days</option>
            <option value="economy">Economy ground, 10–14 days</option>
          </select>
          {errors?.shippingMethod ? (
            <p className={errorClassName}>{errors.shippingMethod.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="po-payment-method" className={labelClassName}>
            Payment
          </label>
          <select
            id="po-payment-method"
            className={cn(fieldClassName, "cursor-pointer")}
            aria-invalid={errors?.paymentMethod ? true : undefined}
            {...register("paymentMethod")}
            name="paymentMethod"
            onChange={handlePaymentMethodChange}
          >
            <option value="cod">Cash on delivery, GST 16%</option>
            <option value="card">Card, GST 5%</option>
          </select>
          {errors?.paymentMethod ? (
            <p className={errorClassName}>{errors.paymentMethod.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="po-status" className={labelClassName}>
            Status
          </label>
          <select
            id="po-status"
            className={cn(fieldClassName, "cursor-pointer")}
            aria-invalid={errors?.status ? true : undefined}
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
                <option value="partially_received">Partially received</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
                <option value="overdue">Overdue</option>
              </>
            )}
          </select>
          {errors?.status ? (
            <p className={errorClassName}>{errors.status.message}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
