export default function InventoryPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center  dark:border-slate-800 dark:bg-slate-900">
        <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
          <span className="material-symbols-outlined text-sm">
            rocket_launch
          </span>
          Coming Soon
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Inventory Workspace Is On The Way
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Advanced stock tracking, receiving logs, and movement controls will be
          available here in a future release.
        </p>
      </div>
    </section>
  );
}
