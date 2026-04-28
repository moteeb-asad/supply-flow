export default function SkuReceivingPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
          <span className="material-symbols-outlined text-sm">schedule</span>
          Coming Soon
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
          SKU Receiving Is In Progress
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Goods receiving workflows, quantity verification, and supplier
          delivery logging will be available here in an upcoming release.
        </p>
      </div>
    </section>
  );
}
