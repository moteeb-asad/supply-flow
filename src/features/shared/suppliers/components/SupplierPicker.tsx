"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getActiveSuppliersAction } from "@/src/features/shared/suppliers/actions/get-active-suppliers.action";
import type { SharedSupplierOption } from "@/src/features/shared/suppliers/types";
import type { SupplierPickerProps } from "../types";

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
      queryKey: ["supplier-picker", debouncedQuery],
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
      <label className="text-sm font-semibold text-[#0e121b]">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-[#4e6797]">
          <span className="material-symbols-outlined text-[18px] leading-none">
            search
          </span>
        </span>
        <input
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
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
            className="absolute inset-y-0 right-3 flex items-center text-[#4e6797] transition-colors hover:text-[#0e121b] cursor-pointer"
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
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
            onScroll={handleDropdownScroll}
          >
            {isLoading ? (
              <p className="px-4 py-3 text-sm text-[#4e6797]">
                Loading suppliers...
              </p>
            ) : options.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#4e6797]">
                No active suppliers found.
              </p>
            ) : (
              options.map((supplier) => (
                <button
                  className="w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  key={supplier.id}
                  onMouseDown={(event) =>
                    handleOptionMouseDown(event, supplier)
                  }
                  onPointerDown={(event) =>
                    handleOptionPointerDown(event, supplier)
                  }
                  type="button"
                >
                  <p className="text-sm font-semibold text-[#0e121b]">
                    {supplier.name}
                  </p>
                  <p className="text-xs text-[#4e6797]">
                    {(supplier.category ?? "uncategorized").toUpperCase()} •{" "}
                    {supplier.status ?? "unknown"}
                  </p>
                </button>
              ))
            )}

            {isFetchingNextPage ? (
              <p className="px-4 py-3 text-sm text-[#4e6797]">
                Loading more suppliers...
              </p>
            ) : null}

            {!hasNextPage && options.length > 0 ? (
              <p className="px-4 py-2 text-center text-xs text-[#4e6797]">
                End of supplier list
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : selectedSupplier ? (
        <p className="text-xs text-[#4e6797]">
          Selected: {selectedSupplier.name} ({supplierStatusLabel})
        </p>
      ) : (
        <p className="text-xs text-[#4e6797]">
          Select one active supplier from results.
        </p>
      )}
    </div>
  );
}
