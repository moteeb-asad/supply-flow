"use client";

import CategoryPicker from "@/src/features/shared/categories/components/CategoryPicker";
import {
  InventoryItemFiltersValue,
  StockStatus,
} from "@/src/features/inventory/types/query.types";
import type { SharedCategoryOption } from "@/src/features/shared/categories/types";

export default function InventoryTableFilters({
  onChange,
  values,
}: {
  onChange: (filters: InventoryItemFiltersValue) => void;
  values?: InventoryItemFiltersValue;
}) {
  const stockStatusOptions = [
    { value: "good", label: "Good" },
    { value: "low", label: "Low" },
    { value: "critical", label: "Critical" },
  ];

  const handleStockStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as StockStatus | "";
    onChange({
      ...values,
      stockStatus: value || undefined,
    });
  };

  const handleCategoryChange = (category: SharedCategoryOption | null) => {
    onChange({
      ...values,
      category: category?.id || undefined,
      categoryName: category?.name || undefined,
    });
  };

  const handlePriceRangeChange = (
    key: "unitPriceMin" | "unitPriceMax",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rawValue = e.target.value.trim();
    const nextValue = rawValue === "" ? undefined : Number(rawValue);

    onChange({
      ...values,
      [key]: Number.isFinite(nextValue) ? nextValue : undefined,
    });
  };
  return (
    <>
      {/* Categories  */}
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Category
        </h3>
        <CategoryPicker
          label=""
          initialCategoryId={values?.category}
          initialCategoryName={values?.categoryName}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      {/* Unit Price Range  */}
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Unit Price Range
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">
              $
            </span>
            <input
              className="w-full bg-surface-variant border-[#d0d7e7] rounded-lg py-2 pl-6 pr-2 text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="Min"
              type="number"
              value={values?.unitPriceMin ?? ""}
              onChange={(event) =>
                handlePriceRangeChange("unitPriceMin", event)
              }
            />
          </div>
          <span className="text-on-surface-variant text-xs font-bold">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">
              $
            </span>
            <input
              className="w-full bg-surface-variant border-[#d0d7e7] rounded-lg py-2 pl-6 pr-2 text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="Max"
              type="number"
              value={values?.unitPriceMax ?? ""}
              onChange={(event) =>
                handlePriceRangeChange("unitPriceMax", event)
              }
            />
          </div>
        </div>
      </div>
      {/* Stock Status  */}
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Stock Status
        </h3>
        <select
          className="w-full bg-white border border-[#d0d7e7] rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          value={values?.stockStatus || ""}
          onChange={handleStockStatusChange}
        >
          <option key="" value="">
            All Stock Statuses
          </option>
          {stockStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
