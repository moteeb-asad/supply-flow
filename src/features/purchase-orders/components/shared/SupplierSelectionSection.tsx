type SupplierSelectionSectionProps = {
  supplierName?: string;
};

export default function SupplierSelectionSection({
  supplierName,
}: SupplierSelectionSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-[20px]">store</span>
        <h3 className="font-semibold text-sm uppercase tracking-wider">
          Supplier Selection
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Supplier Name
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">
            search
          </span>
          <select
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none outline-none transition-all"
            defaultValue={supplierName || ""}
          >
            <option disabled value="">
              Search and select supplier...
            </option>
            <option value="Global Logistics Inc.">Global Logistics Inc.</option>
            <option value="Prime Manufacturing Co.">
              Prime Manufacturing Co.
            </option>
            <option value="TechComponents Ltd.">TechComponents Ltd.</option>
            <option value="Swift Shipments">Swift Shipments</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none">
            unfold_more
          </span>
        </div>
      </div>
    </section>
  );
}
