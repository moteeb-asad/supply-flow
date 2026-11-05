import { useWatch } from "react-hook-form";
import type {
  StartReceivingLineItemValue,
  SummaryFinalNotesProps,
} from "../../types";

// Single pass; useWatch already re-renders only when line_items change.
function summarize(lineItems: StartReceivingLineItemValue[]) {
  const summary = {
    totalLines: lineItems.length,
    totalQtyReceiving: 0,
    totalRejected: 0,
    varianceCount: 0,
  };

  for (const item of lineItems) {
    const received = Number(item.qty_received) || 0;
    const rejected = Number(item.qty_rejected) || 0;
    summary.totalQtyReceiving += received;
    summary.totalRejected += rejected;
    if (rejected > 0 || received < item.remaining_qty) {
      summary.varianceCount += 1;
    }
  }

  return summary;
}

export default function SummaryFinalNotes({
  register,
  control,
}: SummaryFinalNotesProps) {
  const lineItems = useWatch({ control, name: "line_items" });
  const summary = summarize(lineItems ?? []);

  const totals = [
    { label: "Total lines", value: summary.totalLines },
    { label: "Total qty receiving", value: summary.totalQtyReceiving },
    {
      label: "Total rejected",
      value: summary.totalRejected,
      warn: summary.totalRejected > 0,
    },
    {
      label: "Variance count",
      value: summary.varianceCount,
      warn: summary.varianceCount > 0,
    },
  ];

  return (
    <>
      <section
        aria-labelledby="receiving-notes"
        className="space-y-3 border-t border-line-soft pt-6"
      >
        <label
          id="receiving-notes"
          htmlFor="receiving-notes-input"
          className="text-[13px] font-semibold"
        >
          Notes <span className="font-normal text-subtle">optional</span>
        </label>
        <textarea
          id="receiving-notes-input"
          rows={3}
          className="block w-full resize-none rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15"
          placeholder="Condition on arrival, seal numbers, anything to follow up"
          {...register("notes")}
        />
      </section>

      <section aria-label="Summary">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line text-[13px] sm:grid-cols-4">
          {totals.map((total) => (
            <div key={total.label} className="bg-surface px-3 py-2">
              <dt className="text-xs text-muted">{total.label}</dt>
              <dd
                className={`mt-0.5 text-[15px] font-medium tabular-nums ${total.warn ? "text-warning" : ""}`}
              >
                {total.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
