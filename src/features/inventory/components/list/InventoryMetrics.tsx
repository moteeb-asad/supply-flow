import { useQuery } from "@tanstack/react-query";
import { StatCard, StatStrip } from "@/src/components/ui/StatCard";
import { StatusPill } from "@/src/components/ui/StatusPill";
import { getInventoryMetricsAction } from "../../actions/get-inventory-metrics.action";
import {
  inventoryKeys,
  INVENTORY_METRICS_REFETCH_INTERVAL_MS,
} from "../../constants/query-keys";

const valueFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});
const countFormatter = new Intl.NumberFormat("en-US");

// Whole-business figures from get_inventory_metrics (migration 049).
// Independent of the table: search, filters and tabs never change them.
export default function InventoryMetrics() {
  const { data, isPending, isError } = useQuery({
    queryKey: inventoryKeys.metrics,
    queryFn: async () => {
      const result = await getInventoryMetricsAction();
      if (!result.success) {
        throw new Error("Failed to fetch inventory metrics");
      }
      return result.data;
    },
    staleTime: 60_000,
    refetchInterval: INVENTORY_METRICS_REFETCH_INTERVAL_MS,
  });

  // "…" while loading, "—" when the query failed, never a fake zero.
  const display = (
    format: (n: number) => React.ReactNode,
    raw?: number | string,
  ) => {
    if (isPending) return "…";
    if (isError || raw === undefined) return "—";
    return format(Number(raw));
  };

  const lowStock = data ? Number(data.low_stock_count) : 0;

  return (
    <StatStrip aria-label="Stock totals">
      <StatCard
        label="Total stock value"
        value={display(valueFormatter.format, data?.total_stock_value)}
        caption="Units on hand at standard unit price"
      />
      <StatCard
        label="Low stock"
        value={display(
          (n) => `${countFormatter.format(n)} ${n === 1 ? "item" : "items"}`,
          data?.low_stock_count,
        )}
        hint={
          lowStock > 0 ? (
            <StatusPill tone="danger">Action required</StatusPill>
          ) : null
        }
        caption="50 units or fewer on hand"
      />
      <StatCard
        label="Out of stock"
        value={display(
          (n) => (
            <>
              {countFormatter.format(n)}{" "}
              <span className="text-base font-normal text-subtle">
                {n === 1 ? "SKU" : "SKUs"}
              </span>
            </>
          ),
          data?.out_of_stock_count,
        )}
        caption="No units on hand"
      />
    </StatStrip>
  );
}
