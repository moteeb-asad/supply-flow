"use client";

import { TableHeaderProps } from "../types";
import { useState, useEffect } from "react";
import TableSearch from "./TableSearch";

export default function TableHeader({
  showFilter = true,
  onSearch,
  onFilterClick,
  searchPlaceholder,
  isFilterOpen,
  filters,
}: TableHeaderProps & {
  filters?: { roles?: string[]; lastLoginRange?: string };
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (onSearch) onSearch(search);
  }, [search]);

  const filtersApplied = !!(
    filters &&
    ((filters.roles && filters.roles.length < 3) ||
      (filters.lastLoginRange && filters.lastLoginRange !== "Last 7 days"))
  );

  return (
    <div className="p-4 border-b border-[#e7ebf3] flex items-center justify-between">
      <TableSearch
        value={search}
        onChange={setSearch}
        placeholder={searchPlaceholder}
      />
      {showFilter && (
        <div className="flex items-center gap-2">
          <button
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border border-[#e7ebf3] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
              isFilterOpen || filtersApplied
                ? "bg-primary text-white border-primary"
                : "text-[#4e6797]"
            }`}
            onClick={onFilterClick}
          >
            <span className="material-symbols-outlined text-lg">
              filter_alt
            </span>
            Filter
          </button>
        </div>
      )}
    </div>
  );
}
