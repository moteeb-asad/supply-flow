export default function DashboardPage() {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Summary Statistics  */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#e7ebf3] flex flex-col gap-1">
            <p className="text-sm font-medium text-[#4e6797]">
              Total Active Suppliers
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold">48</h3>
              <span className="text-success text-sm font-medium flex items-center">
                +5%
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
              </span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#e7ebf3] flex flex-col gap-1">
            <p className="text-sm font-medium text-[#4e6797]">
              Avg. Delivery Rate
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold">92.4%</h3>
              <span className="text-danger text-sm font-medium flex items-center">
                -2%
                <span className="material-symbols-outlined text-sm">
                  trending_down
                </span>
              </span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#e7ebf3] flex flex-col gap-1">
            <p className="text-sm font-medium text-[#4e6797]">
              Inventory Health
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold">88.2%</h3>
              <span className="text-success text-sm font-medium flex items-center">
                +1%
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
              </span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#e7ebf3] flex flex-col gap-1">
            <p className="text-sm font-medium text-[#4e6797]">Monthly Spend</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold">$124k</h3>
              <span className="text-success text-sm font-medium flex items-center">
                +12%
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
