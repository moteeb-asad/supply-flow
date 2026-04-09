type InventoryItemFormFooterProps = {
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
};

export default function InventoryItemFormFooter({
  isSubmitting = false,
  onCancel,
  submitLabel = "Add Item",
}: InventoryItemFormFooterProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[#e7ebf3] bg-white p-6">
      <button
        className="w-1/2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#4e6797] transition-colors hover:bg-slate-50"
        onClick={onCancel}
        type="button"
      >
        Cancel
      </button>
      <button
        className="flex w-1/2 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        {isSubmitting ? "Adding..." : submitLabel}
      </button>
    </div>
  );
}
