"use client";

import { DATE_RANGE_OPTIONS } from "@/src/constants/dateRangeOptions";
import type { PurchaseOrdersFiltersValue } from "../../types";
import type { FilterPeriod } from "@/src/lib/date-range-utils";
import {
  filterHeadingClassName,
  filterSelectClassName,
} from "@/src/components/data-table/filters/filter-styles";

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
        <h3 className={filterHeadingClassName}>Date range</h3>
        <select
          className={filterSelectClassName}
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
