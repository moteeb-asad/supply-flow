import { TotalAmountSectionProps } from "@/src/features/purchase-orders/types";

export default function TotalAmountSection({
  subtotal,
  taxAmount,
  taxLabel,
  totalAmount,
  submitLabel,
  onCancel,
  isSubmitting = false,
}: TotalAmountSectionProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <div className="border-t border-[#e7ebf3] bg-white p-6">
      <div className="space-y-2 mb-6 text-sm">
        <div className="flex justify-between text-[#4e6797]">
          <span>Subtotal</span>
          <span className="font-medium text-[#0e121b]">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-[#4e6797]">
          <span>{taxLabel}</span>
          <span className="font-medium text-[#0e121b]">
            {formatCurrency(taxAmount)}
          </span>
        </div>
        <div className="mt-2 flex justify-between border-t border-[#e7ebf3] pt-2 text-lg font-bold text-[#0e121b]">
          <span>Total Amount</span>
          <span className="text-primary">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          className="w-auto rounded-lg bg-transparent px-6 py-2.5 text-sm font-bold text-[#4e6797] transition-colors hover:bg-gray-50"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Saving...</span>
            </span>
          ) : (
            <>
              <span>{submitLabel}</span>
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
