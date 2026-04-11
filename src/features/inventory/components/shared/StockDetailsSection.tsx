import type { InventoryItemFormValues } from "./InventoryItemForm";

type StockDetailsSectionProps = {
  values: InventoryItemFormValues;
  estimatedValue: number;
  onChange: <K extends keyof InventoryItemFormValues>(
    key: K,
    value: InventoryItemFormValues[K],
  ) => void;
};

export default function StockDetailsSection({
  values,
  estimatedValue,
  onChange,
}: StockDetailsSectionProps) {
  return (
    <section className="space-y-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">
          inventory
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
          Stock Details
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#0e121b]">
            Initial Stock
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none focus:ring-2 focus:ring-primary"
            type="number"
            min={0}
            value={values.initialStock}
            onChange={(event) =>
              onChange("initialStock", Number(event.target.value || 0))
            }
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#0e121b]">
            Unit Price ($)
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none focus:ring-2 focus:ring-primary"
            placeholder="0.00"
            type="number"
            min={0}
            step="0.01"
            value={values.unitPrice}
            onChange={(event) =>
              onChange("unitPrice", Number(event.target.value || 0))
            }
          />
        </div>
      </div>
      <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-xs font-bold text-[#4e6797]">
          Estimated Initial Inventory Value
        </p>
        <p className="mt-1 text-sm font-bold text-[#0e121b]">
          ${estimatedValue.toFixed(2)}
        </p>
      </div>
    </section>
  );
}
