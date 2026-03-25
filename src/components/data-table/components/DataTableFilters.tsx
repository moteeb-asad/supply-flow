import React from "react";
import DataTableFiltersPanel from "../../data-table/components/DataTableFiltersPanel";

export function DataTableFilters({
  filtersOpen,
  config,
  draftFilters,
  setDraftFilters,
  onApply,
  onClear,
}: {
  filtersOpen: boolean;
  config: {
    filters?: React.ComponentType<{
      value: Record<string, unknown>;
      onChange: (filters: Record<string, unknown>) => void;
    }>;
  };
  draftFilters: Record<string, unknown>;
  setDraftFilters: (filters: Record<string, unknown>) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  if (!filtersOpen || !config.filters) return null;
  return (
    <DataTableFiltersPanel onApply={onApply} onClear={onClear}>
      {React.createElement(config.filters, {
        value: draftFilters,
        onChange: setDraftFilters,
      })}
    </DataTableFiltersPanel>
  );
}
