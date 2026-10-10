import { StatCard } from "@/src/components/ui/StatCard";

const hintClassName =
  "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-bold";

export default function InventoryMetrics() {
  return (
    <div className="px-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Inventory Value"
          icon="account_balance_wallet"
          className="border-slate-200"
          iconClassName="bg-blue-50 text-blue-600"
          labelClassName="text-slate-500"
          valueClassName="text-slate-900"
          value="$1,248,500.00"
          hint={
            <span className={`${hintClassName} bg-emerald-50 text-emerald-700`}>
              <span className="material-symbols-outlined !text-xs">
                trending_up
              </span>
              +2.4% vs last month
            </span>
          }
        />
        <StatCard
          label="Low Stock Alerts"
          icon="warning"
          className="border-slate-200"
          iconClassName="bg-red-50 text-red-600"
          labelClassName="text-slate-500"
          valueClassName="text-slate-900"
          value="14 Items"
          hint={
            <span className={`${hintClassName} bg-red-50 text-red-700`}>
              Action required
            </span>
          }
        />
        <StatCard
          label="Items Out of Stock"
          icon="inventory"
          className="border-slate-200"
          iconClassName="bg-amber-50 text-amber-600"
          labelClassName="text-slate-500"
          valueClassName="text-slate-900"
          value="3 SKUs"
          hint={
            <span className={`${hintClassName} bg-amber-50 text-amber-700`}>
              2 since yesterday
            </span>
          }
        />
      </div>
    </div>
  );
}
