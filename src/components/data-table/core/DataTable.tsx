"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { DataTableHeader } from "@/src/components/data-table/core/DataTableHeader";
import { DataTableBody } from "@/src/components/data-table/core/DataTableBody";
import { DataTableFilters } from "@/src/components/data-table/filters/DataTableFilters";
import { DataTableSearchBar } from "@/src/components/data-table/core/DataTableSearchBar";
import { DataTablePaginationBar } from "@/src/components/data-table/core/DataTablePaginationBar";
import DataTableSkeleton from "@/src/components/data-table/core/DataTableSkeleton";

import type { DataTableProps, PaginationState } from "../types";
import useDataTable from "../hooks/useDataTable";

/**
 * Generic DataTable Engine
 *
 * - Feature agnostic
 * - Driven by DataTableConfig
 * - Supports search, pagination, filters
 * - Used by Users, Invitations, and future modules
 */

export default function DataTable<
  T extends { id: string | number },
  P extends {
    page: number;
    pageSize: number;
    search?: string;
    filters?: Record<string, unknown>;
  } = {
    page: number;
    pageSize: number;
    search?: string;
    filters?: Record<string, unknown>;
  },
>({
  config,
  refreshKey,
  onRowClick,
  filters,
}: DataTableProps<T, P> & {
  filters: Record<string, unknown>;
  onFiltersChange: (filters: Record<string, unknown>) => void;
}) {
  /** ---------------- STATE ---------------- */

  const table = useDataTable(filters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 6,
  });
  const setPage = (page: number) => setPagination((p) => ({ ...p, page }));

  /** ---------------- FETCH PARAMS ---------------- */

  const params = useMemo(
    () =>
      ({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search,
        filters: table.appliedFilters, // ← Use appliedFilters, not the prop
      }) as P,
    [pagination.page, pagination.pageSize, search, table.appliedFilters],
  );

  /** ---------------- QUERY KEY ---------------- */

  const queryKey = useMemo(() => {
    const baseKey = config.queryKey
      ? config.queryKey(params)
      : [
          "data-table",
          pagination.page,
          pagination.pageSize,
          search,
          JSON.stringify(table.appliedFilters),
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

  /** ---------------- QUERY ---------------- */

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
  console.log("DataTable data:", data);
  const total = queryData?.total ?? 0;
  const loading = isPending;

  if (error) {
    console.error("DataTable fetch error:", error);
  }

  /** ---------------- HANDLERS ---------------- */

  const handleApplySearch = (value: string) => {
    setSearch(value);
  };

  const handleApplyFilters = () => {
    table.applyFilters();
    setFiltersOpen(false);
  };

  const handleClearFilters = () => {
    table.clearFilters();
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
            <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary text-white text-[11px] px-1.5"></span>
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
              <DataTableBody<T, P>
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

      <DataTableFilters
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
