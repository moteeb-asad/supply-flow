import { useWatch } from "react-hook-form";
import type { LineItemsReceivingSectionProps } from "../../types/form.types";

const VARIANCE_REASONS = ["N/A", "Damaged", "Incorrect Item", "Shortage"];

export default function LineItemsReceivingSection({
  register,
  control,
}: LineItemsReceivingSectionProps) {
  const lineItems = useWatch({ control, name: "line_items" }) ?? [];

  return (
    <>
      <section className="space-y-5 border-t border-slate-200 pt-2">
        <div className="flex items-center justify-between">
          <div className="mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">
              list_alt
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
              LINE ITEMS RECEIVING GRID
            </h3>
          </div>
          <span className="text-[10px] font-medium italic text-[#4e6797]">
            Showing {lineItems.length} active lines
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100 font-medium text-[#4e6797]">
                <th className="w-1/4 px-3 py-2 font-semibold">SKU / Item</th>
                <th className="px-3 py-2 text-center font-semibold">Ordered</th>
                <th className="px-3 py-2 text-center font-semibold">
                  Remaining
                </th>
                <th className="w-20 px-3 py-2 font-semibold">Recv Now</th>
                <th className="w-20 px-3 py-2 font-semibold">Reject</th>
                <th className="px-3 py-2 font-semibold">Variance Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lineItems.map((item, index) => (
                <tr
                  className="transition-colors hover:bg-gray-50"
                  key={item.sku_code}
                >
                  <td className="px-3 py-3">
                    <p className="font-bold text-[#0e121b]">{item.sku_code}</p>
                    <p className="text-[10px] text-[#4e6797]">
                      {item.item_name}
                    </p>
                    <input
                      type="hidden"
                      {...register(
                        `line_items.${index}.purchase_order_item_id` as const,
                      )}
                    />
                    <input
                      type="hidden"
                      {...register(`line_items.${index}.sku_id` as const)}
                    />
                    <input
                      type="hidden"
                      {...register(`line_items.${index}.sku_code` as const)}
                    />
                    <input
                      type="hidden"
                      {...register(`line_items.${index}.item_name` as const)}
                    />
                  </td>
                  <td className="px-3 py-3 text-center font-medium text-[#0e121b]">
                    {item.ordered_qty}
                    <input
                      type="hidden"
                      {...register(`line_items.${index}.ordered_qty` as const, {
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                  <td className="px-3 py-3 text-center font-medium text-[#0e121b]">
                    {item.remaining_qty}
                    <input
                      type="hidden"
                      {...register(
                        `line_items.${index}.remaining_qty` as const,
                        {
                          valueAsNumber: true,
                        },
                      )}
                    />
                    <input
                      type="hidden"
                      {...register(
                        `line_items.${index}.received_qty_so_far` as const,
                        {
                          valueAsNumber: true,
                        },
                      )}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <input
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                      type="number"
                      min={0}
                      {...register(
                        `line_items.${index}.qty_received` as const,
                        {
                          valueAsNumber: true,
                        },
                      )}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <input
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                      type="number"
                      min={0}
                      {...register(
                        `line_items.${index}.qty_rejected` as const,
                        {
                          valueAsNumber: true,
                        },
                      )}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <select
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                      {...register(
                        `line_items.${index}.variance_reason` as const,
                      )}
                    >
                      {VARIANCE_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
