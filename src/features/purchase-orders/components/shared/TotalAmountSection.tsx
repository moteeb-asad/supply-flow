type TotalAmountSectionProps = {
  submitLabel: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

export default function TotalAmountSection({
  submitLabel,
  onCancel,
  isSubmitting = false,
}: TotalAmountSectionProps) {
  return (
    <div className="px-6 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="space-y-2 mb-6 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            $4,250.00
          </span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Tax (8%)</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            $340.00
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-800 pt-2 mt-2">
          <span>Total Amount</span>
          <span className="text-primary">$4,590.00</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : submitLabel}
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
