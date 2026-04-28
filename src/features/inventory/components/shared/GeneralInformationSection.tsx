import CategoryPicker from "@/src/features/shared/categories/components/CategoryPicker";
import type { InventoryItemFormValues } from "../../types/form.types";
import type { GeneralInformationSectionProps } from "../../types/form.types";
export default function GeneralInformationSection({
  errors,
  register,
  setValue,
  clearErrors,
}: GeneralInformationSectionProps) {
  return (
    <section className="space-y-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">
          info
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
          General Information
        </h3>
      </div>
      <div className="grid gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#0e121b]">
            Item Name
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
            placeholder="e.g. Ergonomic Office Chair"
            type="text"
            {...register("itemName")}
            required
          />
          {errors.itemName && (
            <p className="text-xs text-red-600">{errors.itemName.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">SKU</label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#0e121b] uppercase outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              placeholder="SKU-0000"
              type="text"
              {...register("skuCode")}
              required
            />
            {errors.skuCode && (
              <p className="text-xs text-red-600">{errors.skuCode.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">Unit</label>
            <select
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              {...register("unit")}
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select unit
              </option>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="pcs">pcs</option>
              <option value="g">g</option>
              <option value="ml">ml</option>
            </select>
            {errors.unit && (
              <p className="text-xs text-red-600">{errors.unit.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="relative">
            <CategoryPicker
              error={errors.category?.message}
              onCategoryChange={(category) => {
                setValue("category", category?.id ?? "");
                if (category) clearErrors("category");
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
