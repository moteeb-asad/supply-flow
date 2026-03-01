export default function SupplierCard() {
  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#d0d7e7] dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group cursor-pointer p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-symbols-outlined text-2xl">
              nutrition
            </span>
          </div>
          <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
            Active
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#0e121b] dark:text-white group-hover:text-primary transition-colors">
          Global Produce
        </h3>
        <p className="text-[#4e6797] dark:text-slate-400 text-xs mb-6">
          Fresh Fruits &amp; Vegetables
        </p>
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#4e6797] uppercase tracking-wider mb-1">
              Perf. Score
            </span>
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full circular-progress flex items-center justify-center">
                <div className="absolute inset-[3px] bg-white dark:bg-slate-800 rounded-full"></div>
                <span className="relative text-[10px] font-bold">94%</span>
              </div>
            </div>
          </div>
          <div className="flex-1 ml-6 space-y-3">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-[#4e6797]">On-Time</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="flex items-end h-4 gap-0.5">
                <div className="flex-1 bg-primary/20 h-2 rounded-t-sm"></div>
                <div className="flex-1 bg-primary/40 h-3 rounded-t-sm"></div>
                <div className="flex-1 bg-primary/60 h-2.5 rounded-t-sm"></div>
                <div className="flex-1 bg-primary/80 h-4 rounded-t-sm"></div>
                <div className="flex-1 bg-primary h-3.5 rounded-t-sm"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <span className="text-xs font-medium text-[#4e6797]">
            12 Active POs
          </span>
          <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
            arrow_forward
          </span>
        </div>
      </div>
    </>
  );
}
