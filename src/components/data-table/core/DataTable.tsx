"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { DataTableHeader } from "@/src/components/data-table/core/DataTableHeader";
import { DataTableBody } from "@/src/components/data-table/core/DataTableBody";
import { DataTableFilters } from "@/src/components/data-table/filters/DataTableFilters";
import { DataTableSearchBar } from "@/src/components/data-table/search/DataTableSearchBar";
import { DataTablePaginationBar } from "@/src/components/data-table/pagination/DataTablePaginationBar";
import DataTableSkeleton from "@/src/components/data-table/core/DataTableSkeleton";

import type { DataTableProps, PaginationState } from "../types";
import useDataTableState from "../hooks/useDataTableState";

const isFilterValueActive = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const shouldCountFilter = (key: string): boolean => {
  // Exclude helper fields that are used for URL display but represent the same filter
  // e.g., "categoryName" is a helper for "category", should not be counted separately
  return !key.endsWith("Name");
};

/**
 * - Generic DataTable Engine
 * - Feature agnostic Driven by DataTableConfig
 * - Supports search, pagination, filters
 * - Used by Users, Invitations, and future modules
 **/

export default function DataTable<
  T extends { id: string | number },
  P = unknown,
  TFilters extends object = Record<string, never>,
>({
  config,
  onRowClick,
  refreshKey,
  filters,
  onFiltersChange,
}: DataTableProps<T, P, TFilters>) {
  // Filters
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Parse URL filters synchronously during render
  const initialFilters = useMemo(() => {
    if (!config.parseFiltersFromUrl) return filters;
    return config.parseFiltersFromUrl(
      new URLSearchParams(searchParams.toString()),
    );
  }, [config, filters, searchParams]);

  const table = useDataTableState<TFilters>(initialFilters);

  // Search + Pagination
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 6,
  });
  const setPage = (page: number) => {
    setPagination((p) => ({ ...p, page }));
  };

  const params = useMemo(
    () =>
      ({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search,
        filters: table.appliedFilters,
      }) as P,
    [pagination.page, pagination.pageSize, search, table.appliedFilters],
  );

  const activeFilterCount = useMemo(
    () =>
      Object.entries(
        (table.appliedFilters ?? {}) as Record<string, unknown>,
      ).filter(
        ([key, value]) => shouldCountFilter(key) && isFilterValueActive(value),
      ).length,
    [table.appliedFilters],
  );

  // -------- QUERY KEY --------

  const queryKey = useMemo(() => {
    const baseKey = config.queryKey
      ? config.queryKey(params)
      : [
          "data-table",
          pagination.page,
          pagination.pageSize,
          search,
          table.appliedFilters,
        ];

    return refreshKey === undefined ? baseKey : [...baseKey, refreshKey];
  }, [
    config,
    params,
    refreshKey,
    pagination.page,
    pagination.pageSize,
    search,
    table.appliedFilters,
  ]);

  // -------- QUERY --------

  const {
    data: queryData,
    isPending,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => config.fetcher(params),
    placeholderData: keepPreviousData,
  });

  const data = queryData?.data ?? [];
  const total = queryData?.total ?? 0;
  const loading = isPending;

  if (error) {
    console.error("DataTable fetch error:", error);
  }

  // -------- HANDLERS --------

  const handleApplySearch = (value: string) => {
    setSearch(value);
  };

  const handleApplyFilters = () => {
    table.applyFilters();

    const params = new URLSearchParams(searchParams.toString());
    config.writeFiltersToUrl?.(table.draftFilters, params);
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
    setFiltersOpen(false);
  };

  const handleClearFilters = () => {
    // Explicitly reset to the original empty filters prop
    table.setDraftFilters(filters);
    table.setAppliedFilters(filters);

    const params = new URLSearchParams(searchParams.toString());
    config.writeFiltersToUrl?.(filters, params);
    params.delete("page");

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(nextUrl);
    setFiltersOpen(false);
  };

  /** ---------------- RENDER ---------------- */

  return (
    <div className="p-8 space-y-6 relative">
      {/* Search + Filters */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <DataTableSearchBar
          search={search}
          applySearch={handleApplySearch}
          placeholder={config.searchPlaceholder}
        />

        {config.filters && (
          <button
            className={`px-4 py-2.5 border rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer
              bg-white border-[#d0d7e7] text-[#4e6797] hover:bg-slate-50
            `}
            onClick={() => setFiltersOpen((prev) => !prev)}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              filter_alt
            </span>
            <span>Advanced Filters</span>
            {activeFilterCount > 0 ? (
              <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary text-white text-[11px] px-1.5">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        )}
      </div>

      {/* Table */}

      <div className="bg-white rounded-xl border border-[#d0d7e7] overflow-hidden">
        {loading && search ? (
          <DataTableSkeleton type="search" />
        ) : loading ? (
          <DataTableSkeleton type="loading" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <DataTableHeader config={config} />
              <DataTableBody<T, P, TFilters>
                config={config}
                data={data}
                onRowClick={onRowClick}
              />
            </table>
          </div>
        )}

        {/* Pagination */}

        <DataTablePaginationBar
          pagination={pagination}
          total={total}
          onPageChange={setPage}
        />
      </div>

      {/* Filters */}

      <DataTableFilters<TFilters>
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        config={config}
        values={table.draftFilters}
        onChange={table.setDraftFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
}
