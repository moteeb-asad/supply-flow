"use client";

import { TableHeaderProps } from "../types";

export default function TableHeader({
  showFilter = true,
  onSearch,
  onFilterClick,
  searchPlaceholder,
}: TableHeaderProps) {
  return (
    <div className="p-4 border-b border-[#e7ebf3] flex items-center justify-between">
      <div className="relative w-80">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6797] text-xl">
          search
        </span>
        <input
          className="w-full pl-10 pr-4 py-2 bg-background-light border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
          placeholder={searchPlaceholder || "Search by name or email..."}
          type="text"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      {showFilter && (
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#4e6797] border border-[#e7ebf3] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
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
