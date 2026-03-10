type LineItemsSectionProps = {
  onAddItemClick?: () => void;
  initialItems?: Array<{
    skuName: string;
    quantity: number;
    unitPrice: number;
  }>;
};

export default function LineItemsSection({
  onAddItemClick,
  initialItems,
}: LineItemsSectionProps) {
  const rows =
    initialItems && initialItems.length > 0
      ? initialItems
      : [
          {
            skuName: "SF-MOD-402 - Core Processor",
            quantity: 25,
            unitPrice: 120,
          },
          {
            skuName: "SF-CAB-001 - High-Speed Cable",
            quantity: 100,
            unitPrice: 12.5,
          },
        ];

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
            {rows.map((row, index) => (
              <tr key={`${row.skuName}-${index}`}>
                <td className="px-4 py-3">
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    defaultValue={row.skuName}
                    placeholder="Search item..."
                    type="text"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100"
                    defaultValue={String(row.quantity)}
                    type="number"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className="text-slate-400 mr-1">$</span>
                    <input
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100"
                      defaultValue={row.unitPrice.toFixed(2)}
                      type="number"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-4 py-3" colSpan={4}>
                <button
                  className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
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
    </section>
  );
}
