import type { SupplierTermsSectionProps } from "@/src/features/suppliers/types/suppliers.types";

export function SupplierTermsSection({
  register,
  errors,
  leadTimeDays,
}: SupplierTermsSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-primary text-lg">
          handshake
        </span>
        <h4 className="text-xs font-bold text-[#4e6797] uppercase tracking-widest">
          Initial Negotiated Terms
        </h4>
      </div>
      <div className="bg-gray-50 dark:bg-[#111621] p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4e6797]">
              Payment Terms
            </label>
            <select
              className="w-full bg-white dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              {...register("paymentTerms")}
            >
              <option>Net 30</option>
              <option>Net 60</option>
              <option>Net 90</option>
              <option>Due on Receipt</option>
              <option>Advance Payment</option>
            </select>
            {errors.paymentTerms && (
              <p className="text-xs text-danger">
                {errors.paymentTerms.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4e6797]">
              Min. Order Qty (Units)
            </label>
            <input
              className="w-full bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              type="number"
              {...register("minOrderQty", { valueAsNumber: true })}
            />
            {errors.minOrderQty && (
              <p className="text-xs text-danger">
                {errors.minOrderQty.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-[#4e6797]">
              Standard Lead Time
            </label>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
              {leadTimeDays} Days
            </span>
          </div>
          <div className="relative pt-1">
            <input
              className="w-full accent-primary h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
              max="30"
              min="1"
              type="range"
              {...register("leadTimeDays", { valueAsNumber: true })}
            />
            {errors.leadTimeDays && (
              <p className="text-xs text-danger mt-2">
                {errors.leadTimeDays.message}
              </p>
            )}
            <div className="flex justify-between mt-2 text-[10px] text-[#4e6797] font-medium">
              <span className="flex flex-col items-center">
                1<span>Day</span>
              </span>
              <span className="flex flex-col items-center">
                15<span>Days</span>
              </span>
              <span className="flex flex-col items-center">
                30<span>Days</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#4e6797]">Notes</label>
        <textarea
          className="w-full min-h-[96px] bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Add any supplier notes or internal context"
          {...register("notes")}
        />
      </div>
    </section>
  );
}
