export default function DataTableFiltersPanel({
  children,
  onApply,
  onClear,
}: {
  children: React.ReactNode;
  onApply?: () => void;
  onClear?: () => void;
}) {
  return (
    <div className="absolute top-22 right-8 z-50 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-[#d0d7e7] dark:border-slate-700 flex flex-col overflow-hidden max-h-[calc(100vh-150px)] overflow-y-auto">
      <div className="p-5 space-y-6">{children}</div>

      <div className="p-4 border-t border-[#d0d7e7] dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
        <button
          className="text-sm font-semibold text-[#4e6797] hover:text-danger transition-colors px-2 py-1 cursor-pointer"
          onClick={onClear}
          type="button"
        >
          Clear All
        </button>
        <button
          className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
          onClick={onApply}
          type="button"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
