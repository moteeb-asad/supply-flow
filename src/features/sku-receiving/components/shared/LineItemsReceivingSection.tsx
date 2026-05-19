export default function LineItemsReceivingSection() {
  return (
    <>
      <section className="space-y-5 border-t border-slate-200 pt-2">
        <div className="flex items-center justify-between">
          <div className="mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">
              list_alt
            </span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
              LINE ITEMS RECEIVING GRID
            </h3>
          </div>
          <span className="text-[10px] font-medium italic text-[#4e6797]">
            Showing 2 active lines
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100 font-medium text-[#4e6797]">
                <th className="w-1/4 px-3 py-2 font-semibold">SKU / Item</th>
                <th className="px-3 py-2 text-center font-semibold">Ordered</th>
                <th className="px-3 py-2 text-center font-semibold">
                  Remaining
                </th>
                <th className="w-20 px-3 py-2 font-semibold">Recv Now</th>
                <th className="w-20 px-3 py-2 font-semibold">Reject</th>
                <th className="px-3 py-2 font-semibold">Variance Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="transition-colors hover:bg-gray-50">
                <td className="px-3 py-3">
                  <p className="font-bold text-[#0e121b]">SKU-9921-WH</p>
                  <p className="text-[10px] text-[#4e6797]">
                    Wireless Keyboard (Nordic)
                  </p>
                </td>
                <td className="px-3 py-3 text-center font-medium text-[#0e121b]">
                  100
                </td>
                <td className="px-3 py-3 text-center font-medium text-[#0e121b]">
                  40
                </td>
                <td className="px-2 py-3">
                  <input
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                    type="number"
                    value="40"
                    readOnly
                  />
                </td>
                <td className="px-2 py-3">
                  <input
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                    type="number"
                    value="0"
                    readOnly
                  />
                </td>
                <td className="px-3 py-3">
                  <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary">
                    <option>N/A</option>
                    <option>Damaged</option>
                    <option>Incorrect Item</option>
                    <option>Shortage</option>
                  </select>
                </td>
              </tr>

              <tr className="transition-colors hover:bg-gray-50">
                <td className="px-3 py-3">
                  <p className="font-bold text-[#0e121b]">SKU-1044-BLK</p>
                  <p className="text-[10px] text-[#4e6797]">
                    Ergonomic Office Chair
                  </p>
                </td>
                <td className="px-3 py-3 text-center font-medium text-[#0e121b]">
                  12
                </td>
                <td className="px-3 py-3 text-center font-medium text-red-600">
                  12
                </td>
                <td className="px-2 py-3">
                  <input
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                    type="number"
                    value="10"
                    readOnly
                  />
                </td>
                <td className="px-2 py-3">
                  <input
                    className="w-full rounded-lg border border-red-600 bg-red-50 px-3 py-2 text-center text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-red-500"
                    type="number"
                    value="2"
                    readOnly
                  />
                </td>
                <td className="px-3 py-3">
                  <select
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                    defaultValue="Damaged"
                  >
                    <option value="Damaged">Damaged</option>
                    <option value="Incorrect Item">Incorrect Item</option>
                    <option value="Shortage">Shortage</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
