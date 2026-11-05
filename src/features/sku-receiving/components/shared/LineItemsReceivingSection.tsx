import { useWatch } from "react-hook-form";
import { VARIANCE_REASONS } from "../../constants/form-options";
import type { LineItemsReceivingSectionProps } from "../../types";

const inputClassName =
  "h-8 w-full rounded-control border bg-surface px-2 text-[13px] text-ink tabular-nums focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15";

const borderClass = (hasError: boolean) =>
  hasError ? "border-danger ring-3 ring-danger/12" : "border-line";

const errorTextClassName = "mt-1 text-xs text-danger";

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
      <section
        aria-labelledby="receiving-items"
        className="space-y-3 border-t border-line-soft pt-6"
      >
        <h3 id="receiving-items" className="text-[13px] font-semibold">
          Items{" "}
          <span className="font-normal text-subtle">{lineItems.length}</span>
        </h3>
        {listError ? <p className="text-xs text-danger">{listError}</p> : null}
        <div className="scrollbar-thin overflow-x-auto rounded-card border border-line">
          <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
            <thead className="bg-background-light text-xs text-subtle">
              <tr className="border-b border-line">
                <th className="px-3 py-2 font-medium">SKU / Item</th>
                <th className="px-2 py-2 text-right font-medium">Ordered</th>
                <th className="px-2 py-2 text-right font-medium">Remaining</th>
                <th className="w-[84px] px-2 py-2 text-right font-medium">
                  Recv Now
                </th>
                <th className="w-[84px] px-2 py-2 text-right font-medium">
                  Reject
                </th>
                <th className="px-3 py-2 font-medium">Variance Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {lineItems.map((item, index) => {
                const itemErrors = lineErrors?.[index];
                const hasRejected = Number(item.qty_rejected) > 0;

                return (
                  <tr key={item.purchase_order_item_id}>
                    <td className="px-3 py-3">
                      <p className="font-medium">{item.item_name}</p>
                      <p className="font-mono text-xs text-subtle">
                        {item.sku_code}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums text-muted">
                      {item.ordered_qty}
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums">
                      {item.remaining_qty}
                    </td>
                    <td className="px-2 py-3 align-top">
                      <input
                        className={`${inputClassName} text-right ${borderClass(!!itemErrors?.qty_received)}`}
                        type="number"
                        min={0}
                        aria-invalid={!!itemErrors?.qty_received}
                        {...register(`line_items.${index}.qty_received`, {
                          valueAsNumber: true,
                        })}
                      />
                      {itemErrors?.qty_received ? (
                        <p className={errorTextClassName}>
                          {itemErrors.qty_received.message}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-2 py-3 align-top">
                      <input
                        className={`${inputClassName} text-right ${borderClass(!!itemErrors?.qty_rejected)} ${hasRejected && !itemErrors?.qty_rejected ? "border-warning/50 bg-warning-soft/40" : ""}`}
                        type="number"
                        min={0}
                        aria-invalid={!!itemErrors?.qty_rejected}
                        {...register(`line_items.${index}.qty_rejected`, {
                          valueAsNumber: true,
                        })}
                      />
                      {itemErrors?.qty_rejected ? (
                        <p className={errorTextClassName}>
                          {itemErrors.qty_rejected.message}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 align-top">
                      <select
                        className={`${inputClassName} cursor-pointer px-2.5 ${borderClass(!!itemErrors?.variance_reason)}`}
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
                        <p className={errorTextClassName}>
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
