import type { Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import { CHART_SERIES_COLORS } from "../../constants/chart";
import { getSupplierPerformance } from "../../server/get-supplier-performance";
import SupplierPerformanceCard from "./SupplierPerformanceCard";
import SupplierPerformanceChartLazy from "./SupplierPerformanceChartLazy";

type SupplierPerformanceProps = {
  role: Role | null;
};

// Most recent week with deliveries, or null if none in the window.
const latestRate = (values: (number | null)[]) =>
  [...values].reverse().find((value) => value !== null) ?? null;

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
        <p className="px-5 py-12 text-center text-[13px] text-muted">
          Couldn&apos;t load supplier performance. Please refresh the page.
        </p>
      </SupplierPerformanceCard>
    );
  }

  if (trends.series.length === 0) {
    return (
      <SupplierPerformanceCard>
        <p className="px-5 py-12 text-center text-[13px] text-muted">
          Not enough delivery data yet. On-time rates appear once POs with an
          expected delivery date are received.
        </p>
      </SupplierPerformanceCard>
    );
  }

  const legend = (
    <ul className="mt-4 grid grid-cols-3 gap-3 px-5 text-[13px]">
      {trends.series.map((item, index) => {
        const rate = latestRate(item.values);
        return (
          <li
            key={item.name}
            className={`min-w-0 border-t-2 pt-2 ${
              CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]
                .borderClassName
            }`}
          >
            <p className="truncate text-muted" title={item.name}>
              {item.name}
            </p>
            <p className="mt-0.5 text-lg font-medium tabular-nums">
              {rate === null ? "—" : `${rate}%`}
            </p>
          </li>
        );
      })}
    </ul>
  );

  return (
    <SupplierPerformanceCard legend={legend}>
      <figure className="px-3 pb-3 pt-2">
        <SupplierPerformanceChartLazy
          labels={trends.labels}
          series={trends.series}
        />
        <figcaption className="px-2 text-xs text-subtle">
          Dashed lines cross weeks with no deliveries.
        </figcaption>
      </figure>
    </SupplierPerformanceCard>
  );
}
