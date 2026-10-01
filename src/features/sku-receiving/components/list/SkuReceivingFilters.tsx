"use client";

import { DATE_RANGE_OPTIONS } from "@/src/constants/dateRangeOptions";
import type { FilterPeriod } from "@/src/lib/date-range-utils";
import {
  SKU_RECEIVING_STATUSES,
  type SKUReceivingStatus,
} from "../../types/domain.types";
import type { SkuReceivingFiltersValue } from "../../types/query.types";
import { skuReceivingStyles } from "./SkuReceivingColumns";

const selectClassName =
  "w-full bg-white border border-[#d0d7e7] rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none";

export default function SkuReceivingFilters({
  onChange,
  values,
}: {
  onChange: (filters: SkuReceivingFiltersValue) => void;
  values?: SkuReceivingFiltersValue;
}) {
  return (
    <>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
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
              {skuReceivingStyles[status].label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
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
