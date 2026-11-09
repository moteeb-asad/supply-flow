import type { SupplierIdentitySectionProps } from "@/src/features/suppliers/types/suppliers.types";
import { cn } from "@/src/lib/utils";
import {
  FieldError,
  SectionHeading,
  fieldClassName,
  labelClassName,
} from "./fields";

const CATEGORIES = [
  { value: "dry", label: "Dry" },
  { value: "liquid", label: "Liquid" },
  { value: "mixed", label: "Mixed" },
] as const;

export function SupplierIdentitySection({
  register,
  errors,
}: SupplierIdentitySectionProps) {
  return (
    <section aria-labelledby="supplier-identity" className="space-y-4">
      <SectionHeading id="supplier-identity">Identity</SectionHeading>

      <div>
        <label htmlFor="supplier-name" className={labelClassName}>
          Supplier name
        </label>
        <input
          id="supplier-name"
          type="text"
          placeholder="e.g. North Star Distributing"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "supplier-name-error" : undefined}
          className={fieldClassName}
          {...register("name")}
        />
        <FieldError id="supplier-name-error" message={errors.name?.message} />
      </div>

      <div className="grid grid-cols-[1fr_auto] items-end gap-4">
        <fieldset>
          <legend className={labelClassName}>Category</legend>
          {/* Segmented control built from radio buttons. */}
          <div className="mt-1.5 inline-flex w-full rounded-control bg-background-light p-0.5 ring-1 ring-line ring-inset">
            {CATEGORIES.map((category) => (
              <label key={category.value} className="flex-1">
                <input
                  type="radio"
                  value={category.value}
                  className="peer sr-only"
                  {...register("category")}
                />
                <span
                  className={cn(
                    "flex h-8 cursor-pointer items-center justify-center rounded-[5px] text-[13px] font-medium text-muted",
                    "peer-checked:bg-surface peer-checked:text-ink peer-checked:shadow-raised",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40",
                  )}
                >
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="supplier-status" className={labelClassName}>
            Status
          </label>
          <select
            id="supplier-status"
            className={cn(fieldClassName, "w-36 cursor-pointer")}
            {...register("status")}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <FieldError
        id="supplier-category-error"
        message={errors.category?.message ?? errors.status?.message}
      />
    </section>
  );
}
