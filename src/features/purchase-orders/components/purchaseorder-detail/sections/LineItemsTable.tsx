import type { LineItemsTableProps } from "../../../types";
import { StatusPill } from "@/src/components/ui/StatusPill";
import {
  formatAmount,
  formatQuantity,
} from "@/src/features/purchase-orders/utils/formatters";
import { getReceiptProgress } from "@/src/features/purchase-orders/utils/calculations";

export default function LineItemsTable({ lineItems }: LineItemsTableProps) {
  const underReceivedCount = lineItems.filter(
    (item) => item.received_qty < item.ordered_qty,
  ).length;
  const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0);
  const { received, ordered } = getReceiptProgress(lineItems);
  const receivedPercent =
    ordered > 0 ? Math.min(100, (received / ordered) * 100) : 0;

  return (
    <section
      aria-labelledby="po-lines-title"
      className="min-w-0 overflow-hidden rounded-card border border-line xl:col-span-2"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <h2 id="po-lines-title" className="text-[15px] font-semibold">
          Line items{" "}
          <span className="font-normal text-subtle">{lineItems.length}</span>
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted">
          {underReceivedCount > 0 ? (
            <StatusPill tone="danger">
              {underReceivedCount} item{underReceivedCount > 1 ? "s" : ""}{" "}
              under-received
            </StatusPill>
          ) : null}
          {ordered > 0 ? (
            <>
              <span>
                {formatQuantity(received)} of {formatQuantity(ordered)} units
                received
              </span>
              <span
                aria-hidden="true"
                className="h-1.5 w-28 overflow-hidden rounded-full bg-line-soft"
              >
                <span
                  className={`block h-full rounded-full ${received >= ordered ? "bg-success" : "bg-primary"}`}
                  style={{ width: `${receivedPercent}%` }}
                />
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
          <thead className="bg-background-light text-xs text-subtle">
            <tr className="border-y border-line">
              <th scope="col" className="px-5 py-2.5 font-medium">
                SKU / Item
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">
                Qty Ord.
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">
                Qty Rec.
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">
                Unit Price
              </th>
              <th scope="col" className="px-5 py-2.5 text-right font-medium">
                Line Total
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line-soft">
            {lineItems.length === 0 ? (
              <tr>
                <td className="px-5 py-6 text-center text-muted" colSpan={5}>
                  No line items found for this purchase order.
                </td>
              </tr>
            ) : (
              lineItems.map((item) => {
                const missingQty = item.ordered_qty - item.received_qty;
                const isUnderReceived = missingQty > 0;

                return (
                  <tr key={item.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium">{item.sku_name}</p>
                      <p className="font-mono text-xs text-subtle">
                        {item.sku_code}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {formatQuantity(item.ordered_qty)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {isUnderReceived ? (
                        <>
                          <p className="text-danger">
                            {formatQuantity(item.received_qty)}
                          </p>
                          <p className="text-xs text-danger">
                            −{formatQuantity(missingQty)} missing
                          </p>
                        </>
                      ) : (
                        <span className="text-success">
                          {formatQuantity(item.received_qty)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">
                      {formatAmount(item.unit_price)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">
                      {formatAmount(item.line_total)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          <tfoot className="border-t border-line">
            <tr>
              <td className="px-3 py-4 text-right font-medium" colSpan={4}>
                Order subtotal
              </td>
              <td className="px-5 py-4 text-right text-[15px] font-semibold tabular-nums">
                {formatAmount(subtotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
