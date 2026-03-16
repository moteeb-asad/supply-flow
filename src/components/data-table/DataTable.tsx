"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { DataTableHeader } from "./components/DataTableHeader";
import { DataTableBody } from "./components/DataTableBody";
import { DataTableFilters } from "./components/DataTableFilters";
import { DataTableSearchBar } from "./components/DataTableSearchBar";
import { DataTablePaginationBar } from "./components/DataTablePaginationBar";
import DataTableSkeleton from "./DataTableSkeleton";

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
>({ config, refreshKey }: DataTableProps<T, P>) {
  const router = useRouter();

  /** ---------------- STATE ---------------- */

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Record<string, unknown>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>(
    {},
  );
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
  });

  const setPage = (page: number) => setPagination((p) => ({ ...p, page }));

  /** ---------------- FETCH PARAMS ---------------- */

  const params = useMemo(
    () =>
      ({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search,
        filters: appliedFilters,
      }) as P,
    [pagination.page, pagination.pageSize, search, appliedFilters],
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
          JSON.stringify(appliedFilters),
        ];

    return refreshKey === undefined ? baseKey : [...baseKey, refreshKey];
  }, [
    config,
    params,
    refreshKey,
    pagination.page,
    pagination.pageSize,
    search,
    appliedFilters,
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

  function handleApplySearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleApplyFilters() {
    setAppliedFilters(draftFilters);
    setPage(1);
    setFiltersOpen(false);
  }

  function handleClearFilters() {
    setDraftFilters({});
    setAppliedFilters({});
    setSearch("");
    setPage(1);
    setFiltersOpen(false);
  }

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
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 text-[#4e6797] hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => setFiltersOpen((v) => !v)}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              filter_alt
            </span>
            <span>Advanced Filters</span>
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
              {/* <DataTableBody config={config} data={data} /> */}
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
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
}
