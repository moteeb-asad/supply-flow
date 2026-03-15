import { TotalAmountSectionProps } from "@/src/features/purchase-orders/types/purchase-orders.types";

export default function TotalAmountSection({
  subtotal,
  taxAmount,
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
    <div className="px-6 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="space-y-2 mb-6 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Tax (8%)</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {formatCurrency(taxAmount)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-800 pt-2 mt-2">
          <span>Total Amount</span>
          <span className="text-primary">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Saving...</span>
            </span>
          ) : (
            submitLabel
          )}
        </button>
        <button
          className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
