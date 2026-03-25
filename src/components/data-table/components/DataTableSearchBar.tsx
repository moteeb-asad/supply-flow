import React from "react";
import DataTableSearch from "../../data-table/components/DataTableSearch";

export function DataTableSearchBar({
  search,
  applySearch,
  placeholder,
}: {
  search: string;
  applySearch: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <DataTableSearch
      value={search}
      applySearch={applySearch}
      placeholder={placeholder}
    />
  );
}
