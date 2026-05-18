export default function ReceiptHeaderSection() {
  return (
    <>
      <section className="space-y-5 border-t border-slate-200 pt-2">
        <div className="mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">
            assignment
          </span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
            RECEIPT HEADER
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Receipt DateTime <span className="text-red-600">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              type="datetime-local"
              value="2023-10-24T14:30"
              readOnly
            />
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Delivery Note Number
            </label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              placeholder="DN-XXXXX"
              type="text"
            />
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Received By
            </label>
            <input
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-slate-100 px-3 py-2.5 text-sm text-[#4e6797]"
              readOnly
              type="text"
              value="Admin User"
            />
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Receiving Location/Gate
            </label>
            <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary">
              <option>Dock Door 04</option>
              <option>Dock Door 05</option>
              <option>Main Entrance</option>
            </select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Vehicle/Driver Ref
            </label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              placeholder="Plate # / Driver Name"
              type="text"
            />
          </div>
        </div>
      </section>
    </>
  );
}
