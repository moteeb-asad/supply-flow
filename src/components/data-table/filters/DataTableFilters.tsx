import React from "react";
import DataTableFiltersPanel from "@/src/components/data-table/filters/DataTableFiltersPanel";
import type { DataTableFiltersProps } from "../../data-table/types";

export function DataTableFilters({
  filtersOpen,
  config,
  values,
  onChange,
  onApply,
  onClear,
}: DataTableFiltersProps & {
  onApply: () => void;
  onClear: () => void;
}) {
  if (!filtersOpen || !config.filters) return null;

  return (
    <DataTableFiltersPanel onApply={onApply} onClear={onClear}>
      {React.createElement(config.filters, {
        values,
        onChange,
      })}
    </DataTableFiltersPanel>
  );
}
