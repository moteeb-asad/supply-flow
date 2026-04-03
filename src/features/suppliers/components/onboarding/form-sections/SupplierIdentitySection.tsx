import { Input } from "@/src/components/ui/Input";
import type { SupplierIdentitySectionProps } from "@/src/features/suppliers/types/suppliers.types";

export function SupplierIdentitySection({
  register,
  errors,
}: SupplierIdentitySectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-primary text-lg">
          business
        </span>
        <h4 className="text-xs font-bold text-[#4e6797] uppercase tracking-widest">
          Supplier Identity
        </h4>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold flex items-center gap-1">
            Supplier Name <span className="text-danger">*</span>
          </label>
          <Input
            className="w-full bg-white border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="e.g., North Star Distributing"
            type="text"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-danger">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Status</label>
          <select
            className="w-full bg-white border-gray-200 rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            {...register("status")}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="text-xs text-danger">{errors.status.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Category Selection</label>
          <div className="grid grid-cols-3 gap-0 p-1 bg-gray-100 rounded-xl border border-gray-200">
            <label className="relative flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all group has-[:checked]:bg-white has-[:checked]:shadow-sm">
              <Input
                className="hidden"
                type="radio"
                value="dry"
                {...register("category")}
              />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#4e6797] group-has-[:checked]:text-primary transition-colors">
                  inventory
                </span>
                <span className="text-xs font-bold group-has-[:checked]:text-primary">
                  Dry
                </span>
              </div>
            </label>
            <label className="relative flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all group has-[:checked]:bg-white has-[:checked]:shadow-sm">
              <Input
                className="hidden"
                type="radio"
                value="liquid"
                {...register("category")}
              />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#4e6797] group-has-[:checked]:text-primary transition-colors">
                  water_drop
                </span>
                <span className="text-xs font-bold group-has-[:checked]:text-primary">
                  Liquid
                </span>
              </div>
            </label>
            <label className="relative flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all group has-[:checked]:bg-white has-[:checked]:shadow-sm">
              <Input
                className="hidden"
                type="radio"
                value="mixed"
                {...register("category")}
              />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#4e6797] group-has-[:checked]:text-primary transition-colors">
                  layers
                </span>
                <span className="text-xs font-bold group-has-[:checked]:text-primary">
                  Mixed
                </span>
              </div>
            </label>
          </div>
          {errors.category && (
            <p className="text-xs text-danger">{errors.category.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
