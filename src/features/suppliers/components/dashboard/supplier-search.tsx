export default function SupplierSearch() {
  return (
    <>
      <div className="flex-1 min-w-[300px] max-w-md relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6797] text-xl">
          search
        </span>
        <input
          className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          placeholder="Search suppliers by name, ID or category..."
          type="text"
        />
      </div>
    </>
  );
}
