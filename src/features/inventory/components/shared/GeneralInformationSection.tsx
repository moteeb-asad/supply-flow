import CategoryPicker from "@/src/features/shared/categories/components/CategoryPicker";
import { cn } from "@/src/lib/utils";
import type { GeneralInformationSectionProps } from "../../types/form.types";
import {
  errorClassName,
  fieldClassName,
  labelClassName,
  sectionHeadingClassName,
} from "./fields";

const UNITS = ["kg", "g", "litre", "ml", "pcs"];

export default function GeneralInformationSection({
  errors,
  register,
  setValue,
  clearErrors,
}: GeneralInformationSectionProps) {
  return (
    <section aria-labelledby="inventory-item" className="space-y-4">
      <h3 id="inventory-item" className={sectionHeadingClassName}>
        Item
      </h3>

      <div>
        <label htmlFor="inventory-item-name" className={labelClassName}>
          Item name
        </label>
        <input
          id="inventory-item-name"
          type="text"
          placeholder="e.g. Whole Wheat Flour 10 kg"
          aria-invalid={errors.itemName ? true : undefined}
          className={fieldClassName}
          {...register("itemName")}
          required
        />
        {errors.itemName && (
          <p className={errorClassName}>{errors.itemName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-[1fr_120px] gap-4">
        <div>
          <label htmlFor="inventory-sku" className={labelClassName}>
            SKU
          </label>
          <input
            id="inventory-sku"
            type="text"
            placeholder="SKU-0000"
            aria-invalid={errors.skuCode ? true : undefined}
            className={cn(fieldClassName, "font-mono text-[13px] uppercase")}
            {...register("skuCode")}
            required
          />
          {errors.skuCode && (
            <p className={errorClassName}>{errors.skuCode.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="inventory-unit" className={labelClassName}>
            Unit
          </label>
          <select
            id="inventory-unit"
            aria-invalid={errors.unit ? true : undefined}
            className={cn(fieldClassName, "cursor-pointer")}
            {...register("unit")}
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select
            </option>
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.unit && (
            <p className={errorClassName}>{errors.unit.message}</p>
          )}
        </div>
      </div>

      <CategoryPicker
        error={errors.category?.message}
        onCategoryChange={(category) => {
          setValue("category", category?.id ?? "");
          if (category) clearErrors("category");
        }}
      />
    </section>
  );
}
