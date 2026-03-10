export default function PurchaseOrdersMetrics() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-700 dark:text-blue-300">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase">
              Open Commitment
            </p>
            <p className="text-xl font-black text-blue-900 dark:text-blue-100">
              $24,482.50
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-800 rounded-lg text-red-700 dark:text-red-300">
            <span className="material-symbols-outlined">
              running_with_errors
            </span>
          </div>
          <div>
            <p className="text-xs text-red-700 dark:text-red-300 font-bold uppercase">
              Overdue Orders
            </p>
            <p className="text-xl font-black text-red-900 dark:text-red-100">
              3 Orders
            </p>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-800 rounded-lg text-green-700 dark:text-green-300">
            <span className="material-symbols-outlined">task_alt</span>
          </div>
          <div>
            <p className="text-xs text-green-700 dark:text-green-300 font-bold uppercase">
              Completed (MTD)
            </p>
            <p className="text-xl font-black text-green-900 dark:text-green-100">
              58 Orders
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
