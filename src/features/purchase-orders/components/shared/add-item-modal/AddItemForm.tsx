"use client";

import { useEffect, useMemo, useState } from "react";
import { getPurchaseOrderSkusAction } from "../../../actions/get-purchaseorder-skus.action";
import type {
  AddItemFormProps,
  AddItemFormValues,
  PurchaseOrderSkuOption,
} from "../../../types";
import { cn } from "@/src/lib/utils";
import { inputClassName } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import AppIcon from "@/src/components/ui/AppIcon";
import FormErrorBanner from "@/src/components/ui/FormErrorBanner";
import { formatAmount } from "../../../utils/formatters";

const labelClassName = "text-[13px] font-medium text-muted";
const fieldClassName = cn(inputClassName, "mt-1.5 h-9");

const defaultFormValues: AddItemFormValues = {
  skuName: "",
  quantity: 1,
  unitPrice: 0,
};

export default function AddItemForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitError,
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

    const loadSkus = async () => {
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
    };

    const handle = setTimeout(() => void loadSkus(), delay);

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
      <div className="space-y-5 px-6 pb-6 pt-4">
        <FormErrorBanner message={submitError} />

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="add-item-sku" className={labelClassName}>
              SKU / item name
            </label>
            {showSearchResultMeta ? (
              <p className="text-xs text-subtle">
                {skuOptions.length === 0
                  ? "No matching items found"
                  : `${skuOptions.length} item${skuOptions.length === 1 ? "" : "s"} found`}
              </p>
            ) : null}
          </div>
          <div className="relative mt-1.5">
            <AppIcon
              name="search"
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-subtle"
            />
            <input
              id="add-item-sku"
              className={cn(inputClassName, "h-9 pl-8")}
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
              placeholder="Search by SKU code or item name"
              required
              type="text"
              value={query}
            />

            {isResultsOpen ? (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-card border border-line bg-surface p-1 shadow-overlay">
                {isLoadingSkus ? (
                  <p className="px-2.5 py-2 text-[13px] text-muted">
                    Loading items...
                  </p>
                ) : skuOptions.length === 0 ? (
                  <p className="px-2.5 py-2 text-[13px] text-muted">
                    No matching SKU found.
                  </p>
                ) : (
                  skuOptions.map((sku) => (
                    <button
                      className="w-full cursor-pointer rounded-[6px] px-2.5 py-2 text-left hover:bg-background-light"
                      key={sku.id}
                      onClick={() => handleSelectSku(sku)}
                      type="button"
                    >
                      <p className="text-[13px] font-medium text-ink">
                        <span className="font-mono text-[12.5px]">
                          {sku.sku_code}
                        </span>{" "}
                        {sku.name}
                      </p>
                      <p className="text-xs text-subtle">
                        Unit: {sku.unit ?? "n/a"}
                      </p>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="add-item-quantity" className={labelClassName}>
              Quantity
            </label>
            <input
              id="add-item-quantity"
              className={cn(fieldClassName, "tabular-nums")}
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

          <div>
            <label htmlFor="add-item-unit-price" className={labelClassName}>
              Unit price
            </label>
            <div className="relative mt-1.5">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-subtle"
              >
                $
              </span>
              <input
                id="add-item-unit-price"
                className={cn(inputClassName, "h-9 pl-6 tabular-nums")}
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

        <div className="flex items-center justify-between gap-4 rounded-card border border-line-soft bg-background-light px-4 py-3">
          <div>
            <p className="text-[13px] font-medium">Estimated line total</p>
            <p className="text-xs text-subtle">
              Based on {values.quantity} units x ${values.unitPrice.toFixed(2)}
            </p>
          </div>
          <p className="text-[20px] font-semibold tabular-nums">
            {formatAmount(lineTotal)}
          </p>
        </div>
      </div>

      <footer className="flex items-center justify-end gap-2 border-t border-line bg-background-light px-6 py-4">
        <Button
          variant="ghost"
          size="md"
          className="hover:bg-surface"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </Button>
        <Button
          size="md"
          className="px-4"
          disabled={isSubmitting}
          type="submit"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined !text-[18px]"
          >
            add
          </span>
          {isSubmitting ? "Adding..." : "Add item"}
        </Button>
      </footer>
    </form>
  );
}
