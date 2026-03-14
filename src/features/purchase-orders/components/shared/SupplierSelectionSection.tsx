"use client";

import { useEffect, useMemo, useState } from "react";
import { getPurchaseOrderSuppliersAction } from "../../actions/get-purchaseorder-suppliers.action";
import type {
  PurchaseOrderSupplierOption,
  SupplierSelectionSectionProps,
} from "../../types/purchase-orders.types";

export default function SupplierSelectionSection({
  supplierId,
  supplierName,
  error,
}: SupplierSelectionSectionProps) {
  const [query, setQuery] = useState(supplierName ?? "");
  const [selectedSupplier, setSelectedSupplier] =
    useState<PurchaseOrderSupplierOption | null>(
      supplierId && supplierName
        ? {
            id: supplierId,
            name: supplierName,
            category: null,
            status: "active",
          }
        : null,
    );
  const [options, setOptions] = useState<PurchaseOrderSupplierOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadInitial = async () => {
      setIsLoading(true);
      const results = await getPurchaseOrderSuppliersAction({ limit: 8 });
      if (mounted) {
        setOptions(results);
        setIsLoading(false);
      }
    };

    loadInitial();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handle = setTimeout(async () => {
      const results = await getPurchaseOrderSuppliersAction({
        search: query,
        limit: 8,
      });
      setOptions(results);
    }, 280);

    return () => clearTimeout(handle);
  }, [query]);

  const supplierStatusLabel = useMemo(() => {
    return selectedSupplier?.status === "active" ? "Active" : "Inactive";
  }, [selectedSupplier?.status]);

  const handleSelectSupplier = (supplier: PurchaseOrderSupplierOption) => {
    setSelectedSupplier(supplier);
    setQuery(supplier.name);
    setOpen(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined !text-[20px]">store</span>
        <h3 className="font-semibold text-sm uppercase tracking-wider">
          Supplier Selection
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Supplier Name
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 z-10">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedSupplier(null);
              setOpen(true);
            }}
            onBlur={() => {
              setTimeout(() => setOpen(false), 120);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search and select supplier..."
            type="text"
            value={query}
          />

          <input
            name="supplierId"
            type="hidden"
            value={selectedSupplier?.id ?? ""}
          />
          <input
            name="supplierName"
            type="hidden"
            value={selectedSupplier?.name ?? query}
          />

          {open ? (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <p className="px-4 py-3 text-sm text-slate-500">
                  Loading suppliers...
                </p>
              ) : options.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-500">
                  No active suppliers found.
                </p>
              ) : (
                options.map((supplier) => (
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 border-b last:border-b-0 border-slate-100 dark:border-slate-700"
                    key={supplier.id}
                    onClick={() => handleSelectSupplier(supplier)}
                    type="button"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {supplier.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(supplier.category ?? "uncategorized").toUpperCase()} •{" "}
                      {supplier.status ?? "unknown"}
                    </p>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : selectedSupplier ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Selected: {selectedSupplier.name} ({supplierStatusLabel})
          </p>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select one active supplier from results.
          </p>
        )}
      </div>
    </section>
  );
}
