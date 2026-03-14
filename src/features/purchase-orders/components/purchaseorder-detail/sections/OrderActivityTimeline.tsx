export default function OrderActivityTimeline() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-6 text-base font-bold">Order Activity Timeline</h3>

      <div className="relative space-y-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-[2px] before:bg-slate-200 before:content-[''] dark:before:bg-slate-800">
        <div className="relative pl-8">
          <div className="absolute left-0 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background-light bg-primary dark:border-slate-900"></div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Partially Received
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Oct 29, 2023 · 09:14 AM
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              850/1200 Bananas received. 720/800 Oranges received. Warehouse B.
            </p>
          </div>
        </div>

        <div className="relative pl-8">
          <div className="absolute left-0 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background-light bg-primary dark:border-slate-900"></div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Sent to Supplier
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Oct 13, 2023 · 02:45 PM
            </p>
          </div>
        </div>

        <div className="relative pl-8">
          <div className="absolute left-0 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background-light bg-primary dark:border-slate-900"></div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Created
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Oct 12, 2023 · 11:20 AM
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Drafted by John Doe
            </p>
          </div>
        </div>

        <div className="relative pl-8 opacity-40">
          <div className="absolute left-0 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background-light bg-slate-200 dark:border-slate-900 dark:bg-slate-700"></div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Closed
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pending full receipt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
