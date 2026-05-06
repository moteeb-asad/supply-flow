import type { TotalAmountSectionProps } from "@/src/features/purchase-orders/types";
import { formatAmount } from "@/src/features/purchase-orders/utils/formatters";

export default function TotalAmountSection({
  subtotal,
  taxAmount,
  taxLabel,
  totalAmount,
}: TotalAmountSectionProps) {
  return (
    <div className="border-t border-[#e7ebf3] bg-white pt-6">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[#4e6797]">
          <span>Subtotal</span>
          <span className="font-medium text-[#0e121b]">
            {formatAmount(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-[#4e6797]">
          <span>{taxLabel}</span>
          <span className="font-medium text-[#0e121b]">
            {formatAmount(taxAmount)}
          </span>
        </div>
        <div className="mt-2 flex justify-between border-t border-[#e7ebf3] pt-2 text-lg font-bold text-[#0e121b]">
          <span>Total Amount</span>
          <span className="text-primary">{formatAmount(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
