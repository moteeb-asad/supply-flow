export default function InventoryMetrics() {
  return (
    <>
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200  flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Inventory Value
              </span>
              <div className="p-2 bg-blue-50 rounded-lg">
                <span className="material-symbols-outlined text-blue-600">
                  account_balance_wallet
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-900">
                $1,248,500.00
              </h3>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold">
                <span className="material-symbols-outlined text-xs">
                  trending_up
                </span>{" "}
                +2.4% vs last month
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200  flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Low Stock Alerts
              </span>
              <div className="p-2 bg-red-50 rounded-lg">
                <span className="material-symbols-outlined text-red-600">
                  warning
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-900">14 Items</h3>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs font-bold">
                Action required immediately
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200  flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Items Out of Stock
              </span>
              <div className="p-2 bg-amber-50 rounded-lg">
                <span className="material-symbols-outlined text-amber-600">
                  inventory
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-900">3 SKUs</h3>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-bold">
                2 since yesterday
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
