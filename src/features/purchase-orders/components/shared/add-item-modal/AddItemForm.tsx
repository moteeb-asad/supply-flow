"use client";

import { useEffect, useMemo, useState } from "react";
import { getPurchaseOrderSkusAction } from "../../../actions/get-purchaseorder-skus.action";
import type {
  AddItemFormProps,
  AddItemFormValues,
  PurchaseOrderSkuOption,
} from "../../../types/purchase-orders.types";

const defaultFormValues: AddItemFormValues = {
  skuName: "",
  quantity: 1,
  unitPrice: 0,
};

export default function AddItemForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddItemFormProps) {
  const [values, setValues] = useState<AddItemFormValues>(defaultFormValues);
  const [query, setQuery] = useState("");
  const [skuOptions, setSkuOptions] = useState<PurchaseOrderSkuOption[]>([]);
  const [isLoadingSkus, setIsLoadingSkus] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isSkuSelected, setIsSkuSelected] = useState(false);
  const hasSearchQuery = query.trim().length > 0;
  const showSearchResultMeta =
    hasSearchQuery && !isLoadingSkus && !isSkuSelected;

  useEffect(() => {
    let active = true;
    const search = query.trim();
    const delay = search ? 280 : 0;

    const handle = setTimeout(async () => {
      setIsLoadingSkus(true);
      const results = await getPurchaseOrderSkusAction({
        search,
        limit: 8,
      });

      if (!active) {
        return;
      }

      setSkuOptions(results);
      setIsLoadingSkus(false);
    }, delay);

    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [query]);

  const lineTotal = useMemo(() => {
    return Number((values.quantity * values.unitPrice).toFixed(2));
  }, [values.quantity, values.unitPrice]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  const handleSelectSku = (sku: PurchaseOrderSkuOption) => {
    setValues((prev) => ({ ...prev, skuName: sku.name }));
    setQuery(sku.name);
    setIsSkuSelected(true);
    setSkuOptions([sku]);
    setIsResultsOpen(false);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="p-8 space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            SKU / Item Name
          </label>
          {showSearchResultMeta ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {skuOptions.length === 0
                ? "No matching items found"
                : `${skuOptions.length} item${skuOptions.length === 1 ? "" : "s"} found`}
            </p>
          ) : null}
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              onBlur={() => {
                setTimeout(() => setIsResultsOpen(false), 120);
              }}
              onChange={(event) => {
                const next = event.target.value;
                setQuery(next);
                setValues((prev) => ({ ...prev, skuName: next }));
                setIsSkuSelected(false);
                setIsResultsOpen(true);
              }}
              onFocus={() => setIsResultsOpen(true)}
              placeholder="Search SKU by sku code or item name..."
              required
              type="text"
              value={query}
            />

            {isResultsOpen ? (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isLoadingSkus ? (
                  <p className="px-4 py-3 text-sm text-slate-500">
                    Loading items...
                  </p>
                ) : skuOptions.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-500">
                    No matching SKU found.
                  </p>
                ) : (
                  skuOptions.map((sku) => (
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 border-b last:border-b-0 border-slate-100 dark:border-slate-700"
                      key={sku.id}
                      onClick={() => handleSelectSku(sku)}
                      type="button"
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {sku.sku_code} - {sku.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Unit: {sku.unit ?? "n/a"}
                      </p>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Quantity
            </label>
            <input
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              min={1}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  quantity: Number(event.target.value || 0),
                }))
              }
              placeholder="0"
              required
              type="number"
              value={values.quantity}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Unit Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                $
              </span>
              <input
                className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                min={0}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    unitPrice: Number(event.target.value || 0),
                  }))
                }
                required
                step="0.01"
                type="number"
                value={values.unitPrice}
              />
            </div>
          </div>
        </div>

        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/10">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider font-bold text-primary/70">
                Estimated Line Total
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Based on {values.quantity} units x $
                {values.unitPrice.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                ${lineTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center gap-3">
        <button
          className="px-6 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2 transition-all shadow-md shadow-primary/20 disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          {isSubmitting ? "Adding..." : "Add Item"}
        </button>
      </div>
    </form>
  );
}
