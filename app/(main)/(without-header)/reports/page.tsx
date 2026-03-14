export default function ReportsPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
          <span className="material-symbols-outlined text-sm">schedule</span>
          Coming Soon
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Reporting Suite Is In Progress
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Performance dashboards, cost analytics, and exportable operational
          reports will be available here in an upcoming release.
        </p>
      </div>
    </section>
  );
}
