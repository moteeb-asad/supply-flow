"use client";

import { DATE_RANGE_OPTIONS } from "@/src/constants/dateRangeOptions";
import type { PurchaseOrdersFiltersValue } from "../../types";

export default function PurchaseOrdersFilters({
  values,
  onChange,
}: {
  values: PurchaseOrdersFiltersValue;
  onChange: (filters: PurchaseOrdersFiltersValue) => void;
}) {
  const filters = values;

  const setDateRangeFilter = (nextValue: string) => {
    const next = { ...values };
    if (!nextValue) {
      delete next.dateRange;
    } else {
      next.dateRange = nextValue;
    }
    onChange(next);
  };

  return (
    <>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Date Range
        </h3>
        <select
          className="w-full bg-white border border-[#d0d7e7] rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          onChange={(event) => setDateRangeFilter(event.target.value)}
          value={(filters.dateRange as string | undefined) ?? ""}
        >
          {DATE_RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
