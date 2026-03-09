export default function PurchaseOrdersSearch() {
  return (
    <>
      <div className="relative w-full max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6797] text-lg">
          search
        </span>
        <input
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
          placeholder="Search by PO# or Supplier name..."
          type="text"
        />
      </div>
    </>
  );
}
