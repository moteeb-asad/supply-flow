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
    <div className="absolute top-25 right-12 z-50 w-80 bg-white rounded-xl shadow-2xl border border-[#e7ebf3] flex flex-col overflow-hidden max-h-[calc(100vh-150px)] overflow-y-auto">
      <div className="p-5 space-y-6">{children}</div>

      <div className="p-4 border-t border-[#e7ebf3] bg-gray-50/50 flex items-center justify-between">
        <button
          className="text-sm font-semibold text-[#4e6797] hover:text-danger transition-colors px-2 py-1 cursor-pointer"
          onClick={onClear}
        >
          Clear All
        </button>
        <button
          className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
          onClick={onApply}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
