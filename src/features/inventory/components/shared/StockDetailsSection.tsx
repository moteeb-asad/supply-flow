import { useWatch } from "react-hook-form";
import { cn } from "@/src/lib/utils";
import type { StockDetailsSectionProps } from "../../types/form.types";
import {
  errorClassName,
  fieldClassName,
  labelClassName,
  sectionHeadingClassName,
} from "./fields";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const affixClassName =
  "pointer-events-none absolute top-1/2 -translate-y-1/2 text-[13px] text-subtle";

export default function StockDetailsSection({
  errors,
  register,
  control,
}: StockDetailsSectionProps) {
  const initialStock = useWatch({ control, name: "initialStock" }) ?? 0;
  const unitPrice = useWatch({ control, name: "unitPrice" }) ?? 0;
  const unit = useWatch({ control, name: "unit" });
  const estimatedValue = Number(initialStock) * Number(unitPrice);

  return (
    <section
      aria-labelledby="inventory-stock"
      className="space-y-4 border-t border-line-soft pt-6"
    >
      <h3 id="inventory-stock" className={sectionHeadingClassName}>
        Opening stock
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="inventory-quantity" className={labelClassName}>
            Quantity on hand
          </label>
          <div className="relative mt-1.5">
            <input
              id="inventory-quantity"
              type="number"
              min={0}
              inputMode="decimal"
              aria-invalid={errors.initialStock ? true : undefined}
              className={cn(fieldClassName, "mt-0 pr-12 tabular-nums")}
              {...register("initialStock", { valueAsNumber: true })}
            />
            {unit ? (
              <span className={cn(affixClassName, "right-3")}>{unit}</span>
            ) : null}
          </div>
          {errors.initialStock && (
            <p className={errorClassName}>{errors.initialStock.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="inventory-unit-price" className={labelClassName}>
            Unit price
          </label>
          <div className="relative mt-1.5">
            <span className={cn(affixClassName, "left-3")}>$</span>
            <input
              id="inventory-unit-price"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              aria-invalid={errors.unitPrice ? true : undefined}
              className={cn(fieldClassName, "mt-0 pl-6 tabular-nums")}
              {...register("unitPrice", { valueAsNumber: true })}
            />
          </div>
          {errors.unitPrice && (
            <p className={errorClassName}>{errors.unitPrice.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-card bg-background-light px-4 py-3 text-[13px]">
        <span className="text-muted">Stock value</span>
        <span className="font-medium tabular-nums">
          {currencyFormatter.format(
            Number.isFinite(estimatedValue) ? estimatedValue : 0,
          )}
        </span>
      </div>
    </section>
  );
}
