"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { DataTableHeader } from "././components/DataTableHeader";
import { DataTableBody } from "./components/DataTableBody";
import { DataTableFilters } from "././components/DataTableFilters";
import { DataTableSearchBar } from "././components/DataTableSearchBar";
import { DataTablePaginationBar } from "././components/DataTablePaginationBar";
import DataTableSkeleton from "./components/DataTableSkeleton";

import type { DataTableProps, PaginationState } from "./types";

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
  onFiltersChange,
}: DataTableProps<T, P> & {
  filters: Record<string, unknown>;
  onFiltersChange: (filters: Record<string, unknown>) => void;
}) {
  /** ---------------- STATE ---------------- */

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draftFilters, setDraftFilters] =
    useState<Record<string, unknown>>(filters);
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
        filters,
      }) as P,
    [pagination.page, pagination.pageSize, search, filters],
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
          JSON.stringify(filters),
        ];

    return refreshKey === undefined ? baseKey : [...baseKey, refreshKey];
  }, [
    config,
    params,
    refreshKey,
    pagination.page,
    pagination.pageSize,
    search,
    filters,
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
  const total = queryData?.total ?? 0;
  const loading = isPending;

  if (error) {
    console.error("DataTable fetch error:", error);
  }

  /** ---------------- HANDLERS ---------------- */

  const handleApplySearch = (value: string) => {
    setSearch(value);
  }; // Controlled search bar handler

  const handleToggleFilters = () => {
    if (!filtersOpen) {
      setDraftFilters(filters);
    }
    setFiltersOpen((prev) => !prev);
  };

  const handleApplyFilters = () => {
    onFiltersChange(draftFilters);
    setPage(1);
    setFiltersOpen(false);
  };

  const handleClearFilters = () => {
    const statusValue = filters["status"];
    const preservedFilters =
      typeof statusValue === "string" ? { status: statusValue } : {};

    setDraftFilters(preservedFilters);
    onFiltersChange(preservedFilters);
    setPage(1);
    setFiltersOpen(false);
  };

  const activeAdvancedFiltersCount = Object.entries(filters).filter(
    ([key, value]) => key !== "status" && Boolean(value),
  ).length;

  const isAdvancedFiltersActive = activeAdvancedFiltersCount > 0;

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
            className={`px-4 py-2.5 border rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              isAdvancedFiltersActive
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-white dark:bg-slate-800 border-[#d0d7e7] dark:border-slate-700 text-[#4e6797] hover:bg-slate-50"
            }`}
            onClick={handleToggleFilters}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              filter_alt
            </span>
            <span>Advanced Filters</span>
            {isAdvancedFiltersActive ? (
              <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary text-white text-[11px] px-1.5">
                {activeAdvancedFiltersCount}
              </span>
            ) : null}
          </button>
        )}
      </div>

      {/* Table */}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#d0d7e7] dark:border-slate-700 shadow-sm overflow-hidden">
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
        config={config}
        value={draftFilters}
        onChange={setDraftFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
}
