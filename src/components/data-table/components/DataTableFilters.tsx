import React from "react";
import DataTableFiltersPanel from "../../data-table/components/DataTableFiltersPanel";
import type { DataTableFiltersProps } from "../../data-table/types";

export function DataTableFilters({
  filtersOpen,
  config,
  value,
  onChange,
  onApply,
  onClear,
}: DataTableFiltersProps) {
  if (!filtersOpen || !config.filters) return null;
  return (
    <DataTableFiltersPanel onApply={onApply} onClear={onClear}>
      {React.createElement(config.filters, {
        value,
        onChange,
      })}
    </DataTableFiltersPanel>
  );
}
