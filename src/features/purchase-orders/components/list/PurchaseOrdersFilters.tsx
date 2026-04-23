"use client";

import { DATE_RANGE_OPTIONS } from "@/src/constants/dateRangeOptions";
import type {
  PurchaseOrdersFiltersValue,
  PurchaseOrdersFiltersProps,
} from "../../types";

export default function PurchaseOrdersFilters({
  value,
  onChange,
}: PurchaseOrdersFiltersProps) {
  const filters = value as PurchaseOrdersFiltersValue;

  const setFilter = (key: string, nextValue: string) => {
    const next = { ...value };
    if (!nextValue) {
      delete next[key];
    } else {
      next[key] = nextValue;
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
          onChange={(event) => setFilter("dateRange", event.target.value)}
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
