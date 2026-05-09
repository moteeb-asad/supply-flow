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
    <div className="absolute top-full right-0 mt-2 z-50 w-[min(20rem,calc(100vw-2rem))] sm:w-80 max-h-[min(70vh,36rem)] bg-white rounded-xl shadow-2xl border border-[#d0d7e7] flex flex-col overflow-hidden">
      <div className="p-5 space-y-6 overflow-y-auto flex-1">{children}</div>

      <div className="p-4 border-t border-[#d0d7e7] bg-slate-50 flex items-center justify-between shrink-0">
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
