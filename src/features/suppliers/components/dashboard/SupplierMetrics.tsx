import { StatCard } from "@/src/components/ui/StatCard";

export default function SupplierMetrics() {
  return (
    <div className="px-6 pb-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Active Suppliers"
          icon="group"
          className="border-line"
          iconClassName="bg-blue-50 text-primary"
          value="42"
        />
        <StatCard
          label="Avg. Performance Score"
          icon="star"
          className="border-line"
          iconClassName="bg-green-50 text-green-600"
          value="88%"
          hint={
            <span className="text-xs font-bold text-green-500">+2.4%</span>
          }
        />
        <StatCard
          label="Total Spend (YTD)"
          icon="payments"
          className="border-line"
          iconClassName="bg-purple-50 text-purple-600"
          value="$1.24M"
        />
      </div>
    </div>
  );
}
