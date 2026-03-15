"use client";

import React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DataTableFiltersPanel from "./DataTableFiltersPanel";
import DataTablePagination from "./DataTablePagination";
import DataTableSearch from "./DataTableSearch";
import DataTableSkeleton from "./DataTableSkeleton";
import type { DataTableProps, PaginationState } from "./types";

/**
 * Generic DataTable Engine
 *
 * - Feature agnostic
 * - Driven by DataTableConfig
 * - Supports search, pagination, filters
 * - Used by Users, Invitations, and future modules
 * DO NOT add feature-specific logic here.
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

  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // filters editing vs applied
  const [draftFilters, setDraftFilters] = useState<Record<string, unknown>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>(
    {},
  );

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
  });

  /** ---------------- FETCH DATA ---------------- */

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

  const queryKey = useMemo(() => {
    const baseKey = config.queryKey
      ? config.queryKey(params)
      : ([
          "data-table",
          pagination.page,
          pagination.pageSize,
          search,
          appliedFilters,
        ] as const);

    return refreshKey === undefined ? baseKey : [...baseKey, refreshKey];
  }, [
    appliedFilters,
    config,
    pagination.page,
    pagination.pageSize,
    params,
    refreshKey,
    search,
  ]);

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

  /** ---------------- FILTER ACTIONS ---------------- */

  function applyFilters() {
    setAppliedFilters(draftFilters);
    setPagination((p) => ({ ...p, page: 1 }));
    setFiltersOpen(false);
  }

  function clearFilters() {
    setDraftFilters({});
    setAppliedFilters({});
    setSearch("");
    setPagination((p) => ({ ...p, page: 1 }));
    setFiltersOpen(false);
  }

  /** ---------------- APPLY SEARCH ---------------- */

  function applySearch(value: string) {
    setSearch(value);
    setPagination((p) => ({ ...p, page: 1 }));
  }

  /** ---------------- RENDERERS ---------------- */

  const shouldIgnoreRowNavigation = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(
      target.closest(
        'button, a, input, select, textarea, [role="button"], [data-row-click-ignore="true"]',
      ),
    );
  };

  const navigateToRow = (row: T) => {
    if (!config.rowHref) return;
    router.push(config.rowHref(row));
  };

  // Updated table head and body to match the raw HTML structure and classes
  const renderTableHead = () => (
    <thead>
      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-[#d0d7e7] dark:border-slate-700">
        {config.columns.map((col) => (
          <th
            key={col.key}
            className={
              col.className ??
              `px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider ${col.header === "Actions" ? "text-right" : ""}`
            }
          >
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody className="divide-y divide-[#d0d7e7] dark:divide-slate-700">
      {data.length === 0 ? (
        <tr>
          <td
            colSpan={config.columns.length}
            className="text-center py-10 text-sm font-medium text-[#4e6797]"
          >
            No results found
          </td>
        </tr>
      ) : (
        data.map((row) => (
          <tr
            key={row.id}
            className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors ${config.rowHref ? "cursor-pointer" : ""}`}
            onClick={(event) => {
              if (!config.rowHref || shouldIgnoreRowNavigation(event.target)) {
                return;
              }
              navigateToRow(row);
            }}
            onKeyDown={(event) => {
              if (!config.rowHref || shouldIgnoreRowNavigation(event.target)) {
                return;
              }

              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigateToRow(row);
              }
            }}
            role={config.rowHref ? "link" : undefined}
            tabIndex={config.rowHref ? 0 : undefined}
          >
            {config.columns.map((col) => (
              <td key={col.key} className={col.className ?? "px-6 py-4"}>
                {col.cell(row)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );

  /** ---------------- UI ---------------- */

  return (
    <div className="p-8 space-y-6 relative">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DataTableSearch
          value={search}
          applySearch={applySearch}
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

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#d0d7e7] dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Skeleton or Table */}
        {loading && search ? (
          <DataTableSkeleton type="search" />
        ) : loading ? (
          <DataTableSkeleton type="loading" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {renderTableHead()}
              {renderTableBody()}
            </table>
          </div>
        )}

        {/* Pagination */}
        <DataTablePagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={total}
          onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
        />
      </div>

      {/* Filters Panel */}
      {filtersOpen && config.filters && (
        <DataTableFiltersPanel onApply={applyFilters} onClear={clearFilters}>
          {React.createElement(config.filters, {
            value: draftFilters,
            onChange: setDraftFilters,
          })}
        </DataTableFiltersPanel>
      )}
    </div>
  );
}
