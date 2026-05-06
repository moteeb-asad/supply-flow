import type { LineItemsSectionProps } from "@/src/features/purchase-orders/types/form.types";

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
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">
            list_alt
          </span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
            Line Items
          </h3>
        </div>
        <button
          className="flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          onClick={onAddItemClick}
          type="button"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Add Item
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-[#4e6797] font-medium">
              <th className="px-4 py-3 font-semibold">SKU / Item Name</th>
              <th className="px-4 py-3 font-semibold w-24">Qty</th>
              <th className="px-4 py-3 font-semibold w-32">Unit Price</th>
              <th className="px-4 py-3 font-semibold w-12 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fields.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-[#4e6797]"
                  colSpan={4}
                >
                  No line items yet. Click &quot;Add Item&quot; to add your
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

                return (
                  <tr key={field.id}>
                    <td className="px-4 py-3">
                      <input
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0e121b] outline-none transition-all placeholder:text-[#4e6797] focus:border-transparent focus:ring-2 focus:ring-primary"
                        placeholder="Search item..."
                        type="text"
                        {...skuNameField}
                        value={field.skuName}
                        onChange={(event) => {
                          skuNameField.onChange(event);
                          handleSkuNameChange(index, event.currentTarget.value);
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                        min={1}
                        type="number"
                        {...quantityField}
                        value={
                          Number.isFinite(field.quantity) ? field.quantity : 0
                        }
                        onChange={(event) => {
                          quantityField.onChange(event);
                          handleQuantityChange(
                            index,
                            event.currentTarget.value,
                          );
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="mr-1 text-[#4e6797]">$</span>
                        <input
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
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
                            unitPriceField.onChange(event);
                            handleUnitPriceChange(
                              index,
                              event.currentTarget.value,
                            );
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-[#4e6797] transition-colors hover:text-red-500"
                        onClick={() => handleRemoveItem(index)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            <tr>
              <td className="px-4 py-3" colSpan={4}>
                <button
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2 text-[#4e6797] transition-all hover:bg-gray-50"
                  onClick={onAddItemClick}
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Line Item
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {errors ? (
        <p className="text-xs text-red-600">{errors.lineItems?.message}</p>
      ) : null}
    </section>
  );
}
