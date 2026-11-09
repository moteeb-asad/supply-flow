import type { TotalAmountSectionProps } from "@/src/features/purchase-orders/types";
import { formatAmount } from "@/src/features/purchase-orders/utils/formatters";

// Order totals, shown in the drawer footer above the buttons.
export default function TotalAmountSection({
  subtotal,
  taxAmount,
  taxLabel,
  totalAmount,
}: TotalAmountSectionProps) {
  return (
    <dl className="space-y-1 text-[13px]">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="tabular-nums">{formatAmount(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">{taxLabel}</dt>
        <dd className="tabular-nums">{formatAmount(taxAmount)}</dd>
      </div>
      <div className="flex justify-between pt-1 text-[15px] font-semibold">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatAmount(totalAmount)}</dd>
      </div>
    </dl>
  );
}
