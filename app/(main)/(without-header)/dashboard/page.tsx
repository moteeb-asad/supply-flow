import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";
import { StatCard } from "@/src/components/ui/StatCard";
import SupplierPerformanceChart from "@/src/features/dashboard/components/SupplierPerformanceChart";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-6 p-6">
        <div>
          <h3 className="text-2xl font-bold text-ink">
            Welcome back, {displayName}
          </h3>
          <p className="text-muted text-sm mt-1">
            Here&apos;s what&apos;s happening in your warehouse today.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Open Purchase Orders"
            icon="description"
            value="24"
            hint={
              <span className="text-xs font-medium text-muted">
                8 pending approval
              </span>
            }
          />
          <StatCard
            label="Pending Deliveries"
            icon="schedule"
            className="border-transparent bg-primary shadow-lg shadow-primary/20"
            iconClassName="bg-white/20 text-white"
            labelClassName="text-white/80"
            valueClassName="text-white"
            value="12"
            hint={
              <span className="rounded bg-white/20 px-1.5 py-0.5 text-xs font-bold text-white">
                4 Urgent
              </span>
            }
          />
          <StatCard
            label="Low Stock Alerts"
            icon="warning"
            iconClassName="bg-danger/10 text-danger"
            valueClassName="text-danger"
            value="15"
            hint={
              <span className="text-xs font-bold text-danger">
                Critical Level
              </span>
            }
          />
          <StatCard
            label="Total Monthly Spend"
            icon="payments"
            iconClassName="bg-success/10 text-success"
            value="$142.5k"
            hint={
              <span className="text-xs font-medium text-success">+4.2%</span>
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-xl border border-line-soft overflow-hidden">
            <div className="p-6 border-b border-line-soft flex justify-between items-center">
              <h4 className="font-bold">Recent Receiving Activity</h4>
              <button className="text-primary text-xs font-bold hover:underline">
                View All Logs
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-light">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                      SKU / Item
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  <tr>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">SKU-2938</p>
                      <p className="text-[10px] text-muted">
                        Organic Avocado 48ct
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">Global Produce</td>
                    <td className="px-6 py-4 text-sm">45 cs</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success">
                        Verified
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">SKU-1102</p>
                      <p className="text-[10px] text-muted">
                        Whole Milk 1gal
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">Dairy Co.</td>
                    <td className="px-6 py-4 text-sm">120 units</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning/10 text-warning">
                        In-Review
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">SKU-4491</p>
                      <p className="text-[10px] text-muted">
                        Bread Flour 50lb
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">Fine Grain Mill</td>
                    <td className="px-6 py-4 text-sm">10 sk</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success">
                        Verified
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 border-b-0">
                      <p className="text-sm font-semibold">SKU-5502</p>
                      <p className="text-[10px] text-muted">
                        Tomato Sauce 10#
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm border-b-0">Pizza Port</td>
                    <td className="px-6 py-4 text-sm border-b-0">30 cs</td>
                    <td className="px-6 py-4 border-b-0">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger/10 text-danger">
                        Partial
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-line-soft p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold">Supplier Performance Trends</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary"></span>
                  <span className="text-[10px] text-muted">
                    Global Produce
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-success"></span>
                  <span className="text-[10px] text-muted">Fine Grain</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-warning"></span>
                  <span className="text-[10px] text-muted">Dairy Co.</span>
                </div>
              </div>
            </div>
            <SupplierPerformanceChart />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-line-soft p-6">
          <h4 className="font-bold mb-4">Quick Tasks</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 bg-background-light rounded-lg hover:bg-primary/5 transition-colors text-left group">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <div>
                <p className="text-sm font-bold">Generate Bill</p>
                <p className="text-[10px] text-muted">
                  Process pending invoices
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-background-light rounded-lg hover:bg-primary/5 transition-colors text-left group">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">
                  add_shopping_cart
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">New Order</p>
                <p className="text-[10px] text-muted">
                  Restock low inventory
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-background-light rounded-lg hover:bg-primary/5 transition-colors text-left group">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div>
                <p className="text-sm font-bold">Manage Vendors</p>
                <p className="text-[10px] text-muted">
                  Update performance scores
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-background-light rounded-lg hover:bg-primary/5 transition-colors text-left group">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">inventory</span>
              </div>
              <div>
                <p className="text-sm font-bold">Cycle Count</p>
                <p className="text-[10px] text-muted">
                  Reconcile physical stock
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
