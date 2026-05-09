"use client";

import { DATE_RANGE_OPTIONS } from "@/src/constants/dateRangeOptions";
import type { PurchaseOrdersFiltersValue } from "../../types";
import type { FilterPeriod } from "@/src/lib/date-range-utils";

export default function PurchaseOrdersFilters({
  onChange,
  values,
}: {
  onChange: (filters: PurchaseOrdersFiltersValue) => void;
  values?: PurchaseOrdersFiltersValue;
}) {
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FilterPeriod | "";
    onChange({ ...values, dateRange: value || undefined });
  };

  return (
    <>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Date Range
        </h3>
        <select
          className="w-full bg-white border border-[#d0d7e7] rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          value={values?.dateRange || ""}
          onChange={handleDateRangeChange}
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
