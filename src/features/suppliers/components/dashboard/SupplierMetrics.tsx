export default function SupplierMetrics() {
  return (
    <>
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-[#d0d7e7] ">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-primary">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <p className="text-[#4e6797] text-xs font-bold uppercase tracking-wider">
                  Total Active Suppliers
                </p>
                <p className="text-[#0e121b] text-3xl font-black mt-1">42</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#d0d7e7] ">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg text-green-600">
                <span className="material-symbols-outlined">star</span>
              </div>
              <div>
                <p className="text-[#4e6797] text-xs font-bold uppercase tracking-wider">
                  Avg. Performance Score
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[#0e121b] text-3xl font-black mt-1">88%</p>
                  <span className="text-green-500 text-xs font-bold">
                    +2.4%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#d0d7e7] ">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <p className="text-[#4e6797] text-xs font-bold uppercase tracking-wider">
                  Total Spend (YTD)
                </p>
                <p className="text-[#0e121b] text-3xl font-black mt-1">
                  $1.24M
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
