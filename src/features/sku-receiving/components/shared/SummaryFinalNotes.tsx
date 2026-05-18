export default function SummaryFinalNotes() {
  return (
    <>
      <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-2">
        <section className="space-y-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">
              summarize
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
              SUMMARY
            </h3>
          </div>
          <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex justify-between text-xs">
              <span className="text-[#4e6797]">Total Lines</span>
              <span className="font-bold text-[#0e121b]">2</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#4e6797]">Total Qty Receiving</span>
              <span className="font-bold text-[#0e121b]">50</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#4e6797]">Total Rejected</span>
              <span className="font-bold text-red-600">2</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-xs">
              <span className="font-bold text-[#0e121b]">Variance Count</span>
              <span className="rounded bg-red-100 px-1.5 py-0.5 font-bold text-red-600">
                1
              </span>
            </div>
          </div>
        </section>
        <section className="space-y-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">
              notes
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
              FINAL NOTES
            </h3>
          </div>
          <textarea
            className="min-h-[96px] w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
            placeholder="Add optional receipt comments..."
          ></textarea>
        </section>
      </div>
    </>
  );
}
