import type { InventoryItemFormValues } from "./InventoryItemForm";

type GeneralInformationSectionProps = {
  values: InventoryItemFormValues;
  onChange: <K extends keyof InventoryItemFormValues>(
    key: K,
    value: InventoryItemFormValues[K],
  ) => void;
};

export default function GeneralInformationSection({
  values,
  onChange,
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
            value={values.itemName}
            onChange={(event) => onChange("itemName", event.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">SKU</label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#0e121b] uppercase outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              placeholder="SKU-0000"
              type="text"
              value={values.skuCode}
              onChange={(event) => onChange("skuCode", event.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Category
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:ring-2 focus:ring-primary"
                value={values.category}
                onChange={(event) => onChange("category", event.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="equipment">Equipment</option>
                <option value="maintenance">Maintenance</option>
                <option value="facilities">Facilities</option>
                <option value="raw_materials">Raw Materials</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4e6797]">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
