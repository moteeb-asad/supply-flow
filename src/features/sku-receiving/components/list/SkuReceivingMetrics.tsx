export default function SkuReceivingMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-xl border border-slate-200 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">receipt_long</span>
        </div>
        <div>
          <p className="text-[#4e6797] text-xs text-on-surface-variant font-bold uppercase tracking-wider">
            Open Receipts
          </p>
          <p className="text-2xl font-black text-[#0e121b]">128</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
          <span className="material-symbols-outlined ">inventory_2</span>
        </div>
        <div>
          <p className="text-[#4e6797] text-xs text-on-surface-variant font-bold uppercase tracking-wider">
            Received Today
          </p>
          <p className="text-2xl font-black text-[#0e121b]">1,402</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <div>
          <p className="text-[#4e6797] text-xs text-on-surface-variant font-bold uppercase tracking-wider">
            Variance Cases
          </p>
          <p className="text-2xl font-black text-[#0e121b]">14</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-50 rounded-lg text-purple-600 flex items-center justify-center">
          <span className="material-symbols-outlined">payments</span>
        </div>
        <div>
          <p className="text-[#4e6797] text-xs text-on-surface-variant font-bold uppercase tracking-wider">
            Value (MTD)
          </p>
          <p className="text-2xl font-black text-[#0e121b]">$428.5k</p>
        </div>
      </div>
    </div>
  );
}
