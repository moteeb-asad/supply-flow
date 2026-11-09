import type { SupplierTermsSectionProps } from "@/src/features/suppliers/types/suppliers.types";
import { cn } from "@/src/lib/utils";
import {
  FieldError,
  SectionHeading,
  WithSuffix,
  fieldClassName,
  labelClassName,
} from "./fields";

// value is what gets saved, so it stays the same for existing suppliers;
// label is what the user sees.
const PAYMENT_TERMS = [
  { value: "Net 30", label: "Net 30" },
  { value: "Net 60", label: "Net 60" },
  { value: "Net 90", label: "Net 90" },
  { value: "Due on Receipt", label: "Due on receipt" },
  { value: "Advance Payment", label: "Advance payment" },
];

// Room on the right for the unit suffix.
const numberFieldClassName = cn(fieldClassName, "mt-0 pr-12 tabular-nums");

export function SupplierTermsSection({
  register,
  errors,
}: SupplierTermsSectionProps) {
  return (
    <section
      aria-labelledby="supplier-terms"
      className="space-y-4 border-t border-line-soft pt-6"
    >
      <SectionHeading id="supplier-terms">Terms</SectionHeading>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="supplier-payment-terms" className={labelClassName}>
            Payment terms
          </label>
          <select
            id="supplier-payment-terms"
            className={cn(fieldClassName, "cursor-pointer")}
            {...register("paymentTerms")}
          >
            {PAYMENT_TERMS.map((term) => (
              <option key={term.value} value={term.value}>
                {term.label}
              </option>
            ))}
          </select>
          <FieldError
            id="supplier-payment-terms-error"
            message={errors.paymentTerms?.message}
          />
        </div>

        <div>
          <label htmlFor="supplier-lead-time" className={labelClassName}>
            Lead time
          </label>
          <WithSuffix suffix="days">
            <input
              id="supplier-lead-time"
              type="number"
              inputMode="numeric"
              min={1}
              max={30}
              aria-invalid={errors.leadTimeDays ? true : undefined}
              aria-describedby={
                errors.leadTimeDays
                  ? "supplier-lead-time-error"
                  : "supplier-lead-time-hint"
              }
              className={numberFieldClassName}
              {...register("leadTimeDays", { valueAsNumber: true })}
            />
          </WithSuffix>
          {errors.leadTimeDays ? (
            <FieldError
              id="supplier-lead-time-error"
              message={errors.leadTimeDays.message}
            />
          ) : (
            <p
              id="supplier-lead-time-hint"
              className="mt-1 text-xs text-subtle"
            >
              1 to 30
            </p>
          )}
        </div>

        <div>
          <label htmlFor="supplier-min-order" className={labelClassName}>
            Minimum order
          </label>
          <WithSuffix suffix="units">
            <input
              id="supplier-min-order"
              type="number"
              inputMode="numeric"
              min={1}
              aria-invalid={errors.minOrderQty ? true : undefined}
              aria-describedby={
                errors.minOrderQty ? "supplier-min-order-error" : undefined
              }
              className={numberFieldClassName}
              {...register("minOrderQty", { valueAsNumber: true })}
            />
          </WithSuffix>
          <FieldError
            id="supplier-min-order-error"
            message={errors.minOrderQty?.message}
          />
        </div>
      </div>

      <div>
        <label htmlFor="supplier-notes" className={labelClassName}>
          Notes <span className="text-subtle">optional</span>
        </label>
        <textarea
          id="supplier-notes"
          rows={3}
          placeholder="Delivery days, who to call for urgent orders, anything internal"
          className={cn(fieldClassName, "h-auto resize-none py-2")}
          {...register("notes")}
        />
      </div>
    </section>
  );
}
