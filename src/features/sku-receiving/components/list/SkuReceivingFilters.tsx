"use client";

import { DATE_RANGE_OPTIONS } from "@/src/constants/dateRangeOptions";
import type { FilterPeriod } from "@/src/lib/date-range-utils";
import {
  SKU_RECEIVING_STATUSES,
  SKU_RECEIVING_STATUS_STYLES,
} from "../../constants/statuses";
import type { SKUReceivingStatus, SkuReceivingFiltersProps } from "../../types";

const selectClassName =
  "w-full bg-white border border-line rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none";

export default function SkuReceivingFilters({
  onChange,
  values,
}: SkuReceivingFiltersProps) {
  return (
    <>
      <div>
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
          Status
        </h3>
        <select
          className={selectClassName}
          value={values?.status ?? ""}
          onChange={(e) =>
            onChange({
              ...values,
              status: (e.target.value as SKUReceivingStatus) || undefined,
            })
          }
        >
          <option value="">All statuses</option>
          {SKU_RECEIVING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {SKU_RECEIVING_STATUS_STYLES[status].label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
          Received Date
        </h3>
        <select
          className={selectClassName}
          value={values?.dateRange ?? ""}
          onChange={(e) =>
            onChange({
              ...values,
              dateRange: (e.target.value as FilterPeriod) || undefined,
            })
          }
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
