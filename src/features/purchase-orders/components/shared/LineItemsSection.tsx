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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-[20px]">
            list_alt
          </span>
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            Line Items
          </h3>
        </div>
        <button
          className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1"
          onClick={onAddItemClick}
          type="button"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Add Item
        </button>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
              <th className="px-4 py-3 font-semibold">SKU / Item Name</th>
              <th className="px-4 py-3 font-semibold w-24">Qty</th>
              <th className="px-4 py-3 font-semibold w-32">Unit Price</th>
              <th className="px-4 py-3 font-semibold w-12 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-sm text-slate-500 text-center"
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
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
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
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100"
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
                      <span className="text-slate-400 mr-1">$</span>
                      <input
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100"
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
                      className="text-slate-400 hover:text-red-500 transition-colors"
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
                  className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
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

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </section>
  );
}
