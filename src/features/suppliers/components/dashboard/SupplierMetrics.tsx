import { useQuery } from "@tanstack/react-query";
import { StatCard, StatStrip } from "@/src/components/ui/StatCard";
import { getSupplierOverviewMetricsAction } from "../../actions/get-supplier-overview-metrics.action";
import {
  supplierKeys,
  SUPPLIER_METRICS_REFETCH_INTERVAL_MS,
} from "../../constants/query-keys";

const countFormatter = new Intl.NumberFormat("en-US");
const spendFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

// Whole-business figures from get_supplier_overview_metrics (migration 050).
// Independent of the grid: search and category filters never change them.
export default function SupplierMetrics() {
  const { data, isPending, isError } = useQuery({
    queryKey: supplierKeys.metrics,
    queryFn: async () => {
      const result = await getSupplierOverviewMetricsAction();
      if (!result.success) {
        throw new Error("Failed to fetch supplier metrics");
      }
      return result.data;
    },
    staleTime: 60_000,
    refetchInterval: SUPPLIER_METRICS_REFETCH_INTERVAL_MS,
  });

  // "…" while loading, "—" when the query failed or there is no value yet.
  const display = (
    format: (n: number) => string,
    raw?: number | string | null,
  ) => {
    if (isPending) return "…";
    if (isError || raw === undefined || raw === null) return "—";
    return format(Number(raw));
  };

  const deliveries = data ? Number(data.deliveries_this_year) : 0;
  const onTimeCaption = !data
    ? "Deliveries on or before the expected date"
    : deliveries === 0
      ? "No deliveries yet this year"
      : `${countFormatter.format(Number(data.on_time_deliveries_this_year))} of ${countFormatter.format(deliveries)} deliveries on time this year`;

  return (
    <StatStrip aria-label="Supplier totals">
      <StatCard
        label="Active suppliers"
        value={display(countFormatter.format, data?.active_supplier_count)}
      />
      <StatCard
        label="Average performance score"
        value={display((n) => `${n}%`, data?.on_time_rate)}
        caption={onTimeCaption}
      />
      <StatCard
        label="Total spend this year"
        value={display(spendFormatter.format, data?.spend_this_year)}
        caption="Orders sent this year, drafts and cancelled left out"
      />
    </StatStrip>
  );
}
