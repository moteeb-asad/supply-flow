import type { Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import { CHART_SERIES_COLORS } from "../../constants/chart";
import { getSupplierPerformance } from "../../server/get-supplier-performance";
import SupplierPerformanceCard from "./SupplierPerformanceCard";
import SupplierPerformanceChartLazy from "./SupplierPerformanceChartLazy";

type SupplierPerformanceProps = {
  role: Role | null;
};

// Async Server Component in its own Suspense boundary: the aggregation runs in
// Postgres, and only the final weekly points are sent to the client chart.
export default async function SupplierPerformance({
  role,
}: SupplierPerformanceProps) {
  if (!hasPermission(role, "suppliers:view")) return null;

  const trends = await getSupplierPerformance();

  if (!trends) {
    return (
      <SupplierPerformanceCard>
        <p className="py-12 text-center text-sm text-muted">
          Couldn&apos;t load supplier performance. Please refresh the page.
        </p>
      </SupplierPerformanceCard>
    );
  }

  if (trends.series.length === 0) {
    return (
      <SupplierPerformanceCard>
        <p className="py-12 text-center text-sm text-muted">
          Not enough delivery data yet. On-time rates appear once POs with an
          expected delivery date are received.
        </p>
      </SupplierPerformanceCard>
    );
  }

  const legend = (
    <div className="flex flex-wrap gap-3">
      {trends.series.map((item, index) => (
        <div key={item.name} className="flex items-center gap-1.5">
          <span
            className={`size-2 rounded-full ${
              CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length].className
            }`}
          />
          <span className="text-[11px] text-muted">{item.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <SupplierPerformanceCard legend={legend}>
      <SupplierPerformanceChartLazy
        labels={trends.labels}
        series={trends.series}
      />
    </SupplierPerformanceCard>
  );
}
