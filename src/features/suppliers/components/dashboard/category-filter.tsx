export default function CategoryFilter() {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-[#4e6797] mr-2">
          Filter by Category:
        </span>
        <div className="flex bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 p-1 rounded-lg">
          <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-primary text-white">
            All
          </button>
          <button className="px-4 py-1.5 text-xs font-bold rounded-md text-[#4e6797] hover:bg-slate-100 dark:hover:bg-slate-700">
            Dry
          </button>
          <button className="px-4 py-1.5 text-xs font-bold rounded-md text-[#4e6797] hover:bg-slate-100 dark:hover:bg-slate-700">
            Liquid
          </button>
          <button className="px-4 py-1.5 text-xs font-bold rounded-md text-[#4e6797] hover:bg-slate-100 dark:hover:bg-slate-700">
            Fresh
          </button>
        </div>
      </div>
    </>
  );
}
