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
        <h3 className="mb-2 text-[13px] font-semibold">Category</h3>
        <CategoryPicker
          label=""
          initialCategoryId={values?.category}
          initialCategoryName={values?.categoryName}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      {/* Unit Price Range  */}
      <div>
        <h3 className="mb-2 text-[13px] font-semibold">Unit Price Range</h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-xs">
              $
            </span>
            <input
              className="h-9 w-full rounded-control border border-line bg-surface py-0 pl-6 pr-2 text-[13px] tabular-nums focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15"
              placeholder="Min"
              type="number"
              value={values?.unitPriceMin ?? ""}
              onChange={(event) =>
                handlePriceRangeChange("unitPriceMin", event)
              }
            />
          </div>
          <span className="text-subtle text-xs">–</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-xs">
              $
            </span>
            <input
              className="h-9 w-full rounded-control border border-line bg-surface py-0 pl-6 pr-2 text-[13px] tabular-nums focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15"
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
        <h3 className="mb-2 text-[13px] font-semibold">Stock Status</h3>
        <select
          className="h-9 w-full cursor-pointer rounded-control border border-line bg-surface px-3 text-[13px] focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15"
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
