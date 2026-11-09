import type { LineItemsSectionProps } from "@/src/features/purchase-orders/types/form.types";
import { cn } from "@/src/lib/utils";
import { errorClassName, sectionHeadingClassName } from "./fields";

const cellInputClassName =
  "h-8 w-full rounded-control border border-line bg-surface px-2 text-[13px] text-ink placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15";

export default function LineItemsSection({
  register,
  errors,
  onAddItemClick,
  fields,
  update,
  remove,
  onLineItemsChange,
}: LineItemsSectionProps) {
  const handleSkuNameChange = (index: number, value: string) => {
    update(index, { ...fields[index], skuName: value });
    onLineItemsChange?.();
  };

  const handleQuantityChange = (index: number, value: string) => {
    const parsed = Number(value);
    update(index, {
      ...fields[index],
      quantity: Number.isFinite(parsed) ? parsed : 0,
    });
    onLineItemsChange?.();
  };

  const handleUnitPriceChange = (index: number, value: string) => {
    const parsed = Number(value);
    update(index, {
      ...fields[index],
      unitPrice: Number.isFinite(parsed) ? parsed : 0,
    });
    onLineItemsChange?.();
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
    onLineItemsChange?.();
  };

  return (
    <section
      aria-labelledby="po-line-items"
      className="space-y-3 border-t border-line-soft pt-6"
    >
      <div className="flex items-center justify-between">
        <h3 id="po-line-items" className={sectionHeadingClassName}>
          Line items{" "}
          <span className="font-normal text-subtle">{fields.length}</span>
        </h3>
        <button
          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-control px-2 text-[13px] font-medium text-primary hover:bg-primary-soft"
          onClick={onAddItemClick}
          type="button"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined !text-[16px]"
          >
            add
          </span>
          Add item
        </button>
      </div>

      <div className="overflow-x-auto rounded-card border border-line">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="bg-background-light text-xs text-subtle">
            <tr className="border-b border-line">
              <th scope="col" className="px-3 py-2 font-medium">
                SKU / Item Name
              </th>
              <th scope="col" className="w-20 px-2 py-2 text-right font-medium">
                Qty
              </th>
              <th scope="col" className="w-28 px-2 py-2 text-right font-medium">
                Unit Price
              </th>
              <th scope="col" className="w-9">
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {fields.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-6 text-center text-[13px] text-muted"
                  colSpan={4}
                >
                  No line items yet. Click &quot;Add item&quot; to add your
                  first item.
                </td>
              </tr>
            ) : (
              fields.map((field, index) => {
                const skuNameField = register(
                  `lineItems.${index}.skuName` as const,
                );
                const quantityField = register(
                  `lineItems.${index}.quantity` as const,
                  {
                    valueAsNumber: true,
                  },
                );
                const unitPriceField = register(
                  `lineItems.${index}.unitPrice` as const,
                  {
                    valueAsNumber: true,
                  },
                );
                const itemLabel = field.skuName || `line ${index + 1}`;

                return (
                  <tr key={field.id}>
                    <td className="px-3 py-2.5">
                      <input
                        aria-label={`Item name for ${itemLabel}`}
                        className={cellInputClassName}
                        placeholder="Search item..."
                        type="text"
                        {...skuNameField}
                        value={field.skuName}
                        onChange={(event) => {
                          void skuNameField.onChange(event);
                          void handleSkuNameChange(
                            index,
                            event.currentTarget.value,
                          );
                        }}
                      />
                    </td>
                    <td className="px-2 py-2.5">
                      <input
                        aria-label={`Quantity for ${itemLabel}`}
                        className={cn(
                          cellInputClassName,
                          "text-right tabular-nums",
                        )}
                        min={1}
                        type="number"
                        {...quantityField}
                        value={
                          Number.isFinite(field.quantity) ? field.quantity : 0
                        }
                        onChange={(event) => {
                          void quantityField.onChange(event);
                          void handleQuantityChange(
                            index,
                            event.currentTarget.value,
                          );
                        }}
                      />
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="relative">
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-subtle"
                        >
                          $
                        </span>
                        <input
                          aria-label={`Unit price for ${itemLabel}`}
                          className={cn(
                            cellInputClassName,
                            "pl-5 text-right tabular-nums",
                          )}
                          min={0}
                          step="0.01"
                          type="number"
                          {...unitPriceField}
                          value={
                            Number.isFinite(field.unitPrice)
                              ? field.unitPrice
                              : 0
                          }
                          onChange={(event) => {
                            void unitPriceField.onChange(event);
                            void handleUnitPriceChange(
                              index,
                              event.currentTarget.value,
                            );
                          }}
                        />
                      </div>
                    </td>
                    <td className="pr-2">
                      <button
                        aria-label={`Remove ${itemLabel}`}
                        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-control text-subtle hover:bg-danger-soft hover:text-danger"
                        onClick={() => handleRemoveItem(index)}
                        type="button"
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined !text-[16px]"
                        >
                          close
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            <tr>
              <td className="px-3 py-2.5" colSpan={4}>
                <button
                  className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-control border border-dashed border-line text-[13px] text-muted hover:bg-background-light hover:text-ink"
                  onClick={onAddItemClick}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined !text-[16px]"
                  >
                    add
                  </span>
                  New line item
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {errors?.lineItems?.message ? (
        <p className={errorClassName}>{errors.lineItems.message}</p>
      ) : null}
    </section>
  );
}
