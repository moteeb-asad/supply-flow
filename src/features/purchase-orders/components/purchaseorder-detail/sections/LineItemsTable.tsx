import type { LineItemsTableProps } from "../../../types";
import {
  formatAmount,
  formatQuantity,
} from "@/src/features/purchase-orders/utils/formatters";

export default function LineItemsTable({ lineItems }: LineItemsTableProps) {
  const underReceivedCount = lineItems.filter(
    (item) => item.received_qty < item.ordered_qty,
  ).length;
  const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0);

  return (
    <div className="space-y-4 lg:col-span-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Line Items ({lineItems.length})</h3>
        {underReceivedCount > 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
            <span className="material-symbols-outlined text-sm">warning</span>
            {underReceivedCount} item{underReceivedCount > 1 ? "s" : ""}{" "}
            under-received
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                SKU / Item
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Qty Ord.
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Qty Rec.
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Unit Price
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Line Total
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {lineItems.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  colSpan={5}
                >
                  No line items found for this purchase order.
                </td>
              </tr>
            ) : (
              lineItems.map((item) => {
                const missingQty = item.ordered_qty - item.received_qty;
                const isUnderReceived = missingQty > 0;

                return (
                  <tr
                    className={
                      isUnderReceived ? "bg-rose-50/30 dark:bg-rose-900/10" : ""
                    }
                    key={item.id}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {item.sku_code}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.sku_name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-900 dark:text-slate-100">
                      {formatQuantity(item.ordered_qty)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isUnderReceived ? (
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                            {formatQuantity(item.received_qty)}
                          </span>
                          <span className="text-[10px] font-medium text-rose-500">
                            -{formatQuantity(missingQty)} missing
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {formatQuantity(item.received_qty)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-900 dark:text-slate-100">
                      {formatAmount(item.unit_price)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-slate-100">
                      {formatAmount(item.line_total)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          <tfoot className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <td
                className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-slate-100"
                colSpan={4}
              >
                Order Subtotal
              </td>
              <td className="px-6 py-4 text-right text-sm font-black text-primary">
                {formatAmount(subtotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
