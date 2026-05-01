import type { LineItemsSectionProps } from "../../types";

export default function LineItemsSection({
  onAddItemClick,
  initialItems,
  onLineItemsChange,
  error,
}: LineItemsSectionProps) {
  const rows = initialItems ?? [];

  const getIndex = (value: string | undefined): number => {
    if (!value) return -1;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : -1;
  };

  const updateRow = (
    index: number,
    updater: (row: (typeof rows)[number]) => (typeof rows)[number],
  ) => {
    if (index < 0 || index >= rows.length) return;
    const next = rows.map((row, rowIndex) =>
      rowIndex === index ? updater(row) : row,
    );
    onLineItemsChange?.(next);
  };

  const handleSkuNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = getIndex(event.currentTarget.dataset.index);
    const value = event.currentTarget.value;
    updateRow(index, (row) => ({ ...row, skuName: value }));
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = getIndex(event.currentTarget.dataset.index);
    const parsed = Number(event.currentTarget.value);
    updateRow(index, (row) => ({
      ...row,
      quantity: Number.isFinite(parsed) ? parsed : 0,
    }));
  };

  const handleUnitPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const index = getIndex(event.currentTarget.dataset.index);
    const parsed = Number(event.currentTarget.value);
    updateRow(index, (row) => ({
      ...row,
      unitPrice: Number.isFinite(parsed) ? parsed : 0,
    }));
  };

  const handleRemoveItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    const index = getIndex(event.currentTarget.dataset.index);
    if (index < 0 || index >= rows.length) return;
    const next = rows.filter((_, rowIndex) => rowIndex !== index);
    onLineItemsChange?.(next);
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
            {rows.length === 0 ? (
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
              rows.map((row, index) => (
                <tr key={`${row.skuName}-${index}`}>
                  <td className="px-4 py-3">
                    <input
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0e121b] outline-none transition-all placeholder:text-[#4e6797] focus:border-transparent focus:ring-2 focus:ring-primary"
                      data-index={String(index)}
                      name={`lineItems[${index}].skuName`}
                      placeholder="Search item..."
                      type="text"
                      value={row.skuName}
                      onChange={handleSkuNameChange}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                      data-index={String(index)}
                      min={1}
                      name={`lineItems[${index}].quantity`}
                      type="number"
                      value={Number.isFinite(row.quantity) ? row.quantity : 0}
                      onChange={handleQuantityChange}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="mr-1 text-[#4e6797]">$</span>
                      <input
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                        data-index={String(index)}
                        min={0}
                        name={`lineItems[${index}].unitPrice`}
                        step="0.01"
                        type="number"
                        value={
                          Number.isFinite(row.unitPrice) ? row.unitPrice : 0
                        }
                        onChange={handleUnitPriceChange}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-[#4e6797] transition-colors hover:text-red-500"
                      data-index={String(index)}
                      onClick={handleRemoveItem}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))
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

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </section>
  );
}
