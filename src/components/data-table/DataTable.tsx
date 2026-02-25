"use client";

import React from "react";
import { useEffect, useState, useCallback } from "react";
import DataTableFiltersPanel from "./DataTableFiltersPanel";
import DataTablePagination from "./DataTablePagination";
import DataTableSearch from "./DataTableSearch";
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
>({ config }: DataTableProps<T, P>) {
  /** ---------------- STATE ---------------- */

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const result = await config.fetcher({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search,
        filters: appliedFilters,
      } as P);

      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error("DataTable fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [
    config.fetcher,
    pagination.page,
    pagination.pageSize,
    search,
    appliedFilters,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  /** ---------------- RENDERERS ---------------- */

  // Updated table head and body to match the raw HTML structure and classes
  const renderTableHead = () => (
    <thead>
      <tr className="bg-[#f7f9fc]">
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
    <tbody className="divide-y divide-[#e7ebf3]">
      {loading ? (
        <tr>
          <td colSpan={config.columns.length} className="text-center py-8">
            Loading...
          </td>
        </tr>
      ) : data.length === 0 ? (
        <tr>
          <td colSpan={config.columns.length} className="text-center py-8">
            No results found
          </td>
        </tr>
      ) : (
        data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
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
    <div className="flex-1 overflow-y-auto p-8 relative">
      <div className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-[#e7ebf3] flex items-center justify-between">
          <DataTableSearch
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            placeholder={config.searchPlaceholder}
          />

          {config.filters && (
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#4e6797] border border-[#e7ebf3] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <span className="material-symbols-outlined text-lg">
                filter_alt
              </span>
              Filter
            </button>
          )}
        </div>

        {/* Table */}
        <table className="w-full text-left border-collapse">
          {renderTableHead()}
          {renderTableBody()}
        </table>

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
