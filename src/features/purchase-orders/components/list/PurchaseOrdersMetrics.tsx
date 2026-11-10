import { useQuery } from "@tanstack/react-query";
import {
  purchaseOrderKeys,
  PURCHASE_ORDER_METRICS_REFETCH_INTERVAL_MS,
} from "@/src/features/purchase-orders/constants/query-keys";
import { StatCard, StatStrip } from "@/src/components/ui/StatCard";
import { getPurchaseOrderMetricsAction } from "@/src/features/purchase-orders/actions/get-purchaseorder-metrics.action";
import { formatAmount } from "@/src/features/purchase-orders/utils/formatters";

const countFormatter = new Intl.NumberFormat("en-US");

// Whole-business figures from get_purchase_order_metrics (migration 048).
// Independent of the table: search, filters and tabs never change them.
export default function PurchaseOrdersMetrics() {
  const { data, isPending, isError } = useQuery({
    queryKey: purchaseOrderKeys.metrics,
    queryFn: async () => {
      const result = await getPurchaseOrderMetricsAction();
      if (!result.success) {
        throw new Error("Failed to fetch purchase order metrics");
      }
      return result.data;
    },
    staleTime: 60_000,
    refetchInterval: PURCHASE_ORDER_METRICS_REFETCH_INTERVAL_MS,
  });

  // "…" while loading, "—" when the query failed, never a fake zero.
  const display = (format: (n: number) => string, raw?: number | string) => {
    if (isPending) return "…";
    if (isError || raw === undefined) return "—";
    return format(Number(raw));
  };

  const monthName = new Date().toLocaleString("en-US", { month: "long" });

  return (
    <StatStrip aria-label="Order totals">
      <StatCard
        label="Open commitment"
        value={display(formatAmount, data?.open_commitment)}
        caption="Value of orders sent and not yet closed"
      />
      <StatCard
        label="Overdue orders"
        value={display(countFormatter.format, data?.overdue_count)}
        caption="Past their expected delivery date"
      />
      <StatCard
        label="Completed this month"
        value={display(countFormatter.format, data?.completed_this_month)}
        caption={`Closed in ${monthName}`}
      />
    </StatStrip>
  );
}
