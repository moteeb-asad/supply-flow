import type { InventoryItemFormValues } from "./InventoryItemForm";

type SupplierAssignmentSectionProps = {
  values: InventoryItemFormValues;
  onChange: <K extends keyof InventoryItemFormValues>(
    key: K,
    value: InventoryItemFormValues[K],
  ) => void;
};

export default function SupplierAssignmentSection({
  values,
  onChange,
}: SupplierAssignmentSectionProps) {
  return (
    <section className="space-y-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">
          local_shipping
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
          Supplier Assignment
        </h3>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-[#0e121b]">
          Primary Supplier
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none focus:ring-2 focus:ring-primary"
            value={values.primarySupplier}
            onChange={(event) =>
              onChange("primarySupplier", event.target.value)
            }
          >
            <option value="">Search for a supplier</option>
            <option value="apex_industrial_supply">
              Apex Industrial Supply
            </option>
            <option value="global_logistics_partners">
              Global Logistics Partners
            </option>
            <option value="standard_steel_corp">Standard Steel Corp</option>
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4e6797]">
            search
          </span>
        </div>
      </div>

      <div className="mt-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
        <p className="text-center text-xs text-slate-500">
          New supplier?{" "}
          <button
            className="font-bold text-primary hover:underline"
            type="button"
          >
            Add to directory
          </button>
        </p>
      </div>
    </section>
  );
}
