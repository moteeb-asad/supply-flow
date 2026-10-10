import { useWatch } from "react-hook-form";
import { VARIANCE_REASONS } from "../../constants/form-options";
import type { LineItemsReceivingSectionProps } from "../../types";

const inputClassName =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary";

const borderClass = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-200";

export default function LineItemsReceivingSection({
  register,
  errors,
  control,
}: LineItemsReceivingSectionProps) {
  const lineItems = useWatch({ control, name: "line_items" }) ?? [];
  const lineErrors = errors.line_items;
  const listError = lineErrors?.message ?? lineErrors?.root?.message;

  return (
    <>
      <section className="space-y-5 border-t border-slate-200 pt-2">
        <div className="flex items-center justify-between">
          <div className="mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">
              list_alt
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted">
              LINE ITEMS RECEIVING GRID
            </h3>
          </div>
          <span className="text-[10px] font-medium italic text-muted">
            Showing {lineItems.length} active lines
          </span>
        </div>
        {listError ? (
          <p className="text-xs text-red-600">{listError}</p>
        ) : null}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100 font-medium text-muted">
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
              {lineItems.map((item, index) => {
                const itemErrors = lineErrors?.[index];

                return (
                  <tr
                    className="transition-colors hover:bg-gray-50"
                    key={item.purchase_order_item_id}
                  >
                    <td className="px-3 py-3">
                      <p className="font-bold text-ink">
                        {item.sku_code}
                      </p>
                      <p className="text-[10px] text-muted">
                        {item.item_name}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-ink">
                      {item.ordered_qty}
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-ink">
                      {item.remaining_qty}
                    </td>
                    <td className="px-2 py-3 align-top">
                      <input
                        className={`${inputClassName} text-center ${borderClass(!!itemErrors?.qty_received)}`}
                        type="number"
                        min={0}
                        aria-invalid={!!itemErrors?.qty_received}
                        {...register(`line_items.${index}.qty_received`, {
                          valueAsNumber: true,
                        })}
                      />
                      {itemErrors?.qty_received ? (
                        <p className="mt-1 text-[10px] text-red-600">
                          {itemErrors.qty_received.message}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-2 py-3 align-top">
                      <input
                        className={`${inputClassName} text-center ${borderClass(!!itemErrors?.qty_rejected)}`}
                        type="number"
                        min={0}
                        aria-invalid={!!itemErrors?.qty_rejected}
                        {...register(`line_items.${index}.qty_rejected`, {
                          valueAsNumber: true,
                        })}
                      />
                      {itemErrors?.qty_rejected ? (
                        <p className="mt-1 text-[10px] text-red-600">
                          {itemErrors.qty_rejected.message}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 align-top">
                      <select
                        className={`${inputClassName} ${borderClass(!!itemErrors?.variance_reason)}`}
                        aria-invalid={!!itemErrors?.variance_reason}
                        {...register(`line_items.${index}.variance_reason`)}
                      >
                        {VARIANCE_REASONS.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                      {itemErrors?.variance_reason ? (
                        <p className="mt-1 text-[10px] text-red-600">
                          {itemErrors.variance_reason.message}
                        </p>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
