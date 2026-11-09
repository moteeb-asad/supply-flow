"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getActiveSuppliersAction } from "@/src/features/shared/suppliers/actions/get-active-suppliers.action";
import type { SharedSupplierOption } from "@/src/features/shared/suppliers/types";
import type { SupplierPickerProps } from "../types";
import { supplierKeys } from "@/src/features/suppliers/constants/query-keys";

const PAGE_SIZE = 5;

export default function SupplierPicker({
  initialSupplierId,
  initialSupplierName,
  error,
  label = "Supplier Name",
  placeholder = "Search and select supplier...",
  supplierIdFieldName = "supplierId",
  supplierNameFieldName = "supplierName",
  onSupplierChange,
}: SupplierPickerProps) {
  const [query, setQuery] = useState(initialSupplierName ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(
    initialSupplierName ?? "",
  );
  const [selectedSupplier, setSelectedSupplier] =
    useState<SharedSupplierOption | null>(
      initialSupplierId && initialSupplierName
        ? {
            id: initialSupplierId,
            name: initialSupplierName,
            category: null,
            status: "active",
          }
        : null,
    );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 280);

    return () => clearTimeout(handle);
  }, [query]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: supplierKeys.picker(debouncedQuery),
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        getActiveSuppliersAction({
          search: debouncedQuery,
          limit: PAGE_SIZE,
          offset: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
      staleTime: 60_000,
    });

  const options = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const supplierStatusLabel = useMemo(() => {
    return selectedSupplier?.status === "active" ? "Active" : "Inactive";
  }, [selectedSupplier?.status]);

  const handleSelectSupplier = (supplier: SharedSupplierOption) => {
    setSelectedSupplier(supplier);
    setQuery(supplier.name);
    setOpen(false);
    onSupplierChange?.(supplier);
  };

  const handleOptionPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    supplier: SharedSupplierOption,
  ) => {
    event.preventDefault();
    handleSelectSupplier(supplier);
  };

  const handleOptionMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>,
    supplier: SharedSupplierOption,
  ) => {
    event.preventDefault();
    handleSelectSupplier(supplier);
  };

  const handleClearSelection = () => {
    setSelectedSupplier(null);
    setQuery("");
    setOpen(false);
    onSupplierChange?.(null);
  };

  const handleDropdownScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const container = event.currentTarget;
    const remaining =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (remaining < 48) {
      void fetchNextPage();
    }
  };

  const canClear = Boolean(selectedSupplier || query);

  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="text-[13px] font-medium text-muted">{label}</label>
      ) : null}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-2.5 z-10 flex items-center text-subtle">
          <span className="material-symbols-outlined !text-[16px] leading-none">
            search
          </span>
        </span>
        <input
          className="h-9 w-full rounded-control border border-line bg-surface pl-8 pr-9 text-sm text-ink placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15"
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedSupplier(null);
            setOpen(true);
            onSupplierChange?.(null);
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 120);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          type="text"
          value={query}
        />

        {canClear ? (
          <button
            aria-label="Clear selected supplier"
            className="absolute inset-y-0 right-2.5 flex cursor-pointer items-center text-subtle hover:text-ink"
            onClick={handleClearSelection}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] leading-none">
              close
            </span>
          </button>
        ) : null}

        <input
          name={supplierIdFieldName}
          type="hidden"
          value={selectedSupplier?.id ?? ""}
        />
        <input
          name={supplierNameFieldName}
          type="hidden"
          value={selectedSupplier?.name ?? query}
        />

        {open ? (
          <div
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-card border border-line bg-surface p-1 shadow-overlay"
            onScroll={handleDropdownScroll}
          >
            {isLoading ? (
              <p className="px-2.5 py-2 text-[13px] text-muted">
                Loading suppliers...
              </p>
            ) : options.length === 0 ? (
              <p className="px-2.5 py-2 text-[13px] text-muted">
                No active suppliers found.
              </p>
            ) : (
              options.map((supplier) => (
                <button
                  className="w-full cursor-pointer rounded-[6px] px-2.5 py-2 text-left hover:bg-background-light"
                  key={supplier.id}
                  onMouseDown={(event) =>
                    handleOptionMouseDown(event, supplier)
                  }
                  onPointerDown={(event) =>
                    handleOptionPointerDown(event, supplier)
                  }
                  type="button"
                >
                  <p className="text-[13px] font-medium text-ink">
                    {supplier.name}
                  </p>
                  <p className="text-xs text-subtle">
                    {(supplier.category ?? "uncategorized").toUpperCase()} •{" "}
                    {supplier.status ?? "unknown"}
                  </p>
                </button>
              ))
            )}

            {isFetchingNextPage ? (
              <p className="px-2.5 py-2 text-[13px] text-muted">
                Loading more suppliers...
              </p>
            ) : null}

            {!hasNextPage && options.length > 0 ? (
              <p className="px-2.5 py-1.5 text-center text-xs text-subtle">
                End of supplier list
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : selectedSupplier ? (
        <p className="text-xs text-subtle">
          Selected: {selectedSupplier.name} ({supplierStatusLabel})
        </p>
      ) : (
        <p className="text-xs text-subtle">
          Select one active supplier from results.
        </p>
      )}
    </div>
  );
}
