import DataTableSearch from "@/src/components/data-table/core/DataTableSearch";

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
