"use client";

import type {
  PurchaseOrdersFiltersValue,
  PurchaseOrderStatus,
  PurchaseOrdersFiltersProps,
} from "../../types/purchase-orders.types";

const statusOptions: Array<{ value: PurchaseOrderStatus; label: string }> = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "partially_received", label: "Partially Received" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "overdue", label: "Overdue" },
];

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
          Status
        </h3>
        <select
          className="w-full bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          onChange={(event) => setFilter("status", event.target.value)}
          value={filters.status ?? ""}
        >
          <option value="">All Statuses</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Date Range
        </h3>
        <select
          className="w-full bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          onChange={(event) => setFilter("dateRange", event.target.value)}
          value={(filters.dateRange as string | undefined) ?? ""}
        >
          <option value="">All Dates</option>
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="this_month">This Month</option>
          <option value="this_quarter">This Quarter</option>
        </select>
      </div>
    </>
  );
}
