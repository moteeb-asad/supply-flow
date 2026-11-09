import { useQuery } from "@tanstack/react-query";
import { purchaseOrderKeys } from "@/src/features/purchase-orders/constants/query-keys";
import { StatCard, StatStrip } from "@/src/components/ui/StatCard";
import { purchaseOrdersFetcher } from "@/src/features/purchase-orders/fetchers/purchaseorders.fetcher";
import type { PurchaseOrder } from "@/src/features/purchase-orders/types";

export default function PurchaseOrdersMetrics() {
  const { data, isPending } = useQuery({
    queryKey: purchaseOrderKeys.metrics,
    queryFn: async () => {
      // Fetch all orders (up to 1000 for metrics)
      const result = await purchaseOrdersFetcher({ page: 1, pageSize: 1000 });
      return result.data as PurchaseOrder[];
    },
    staleTime: 60000,
  });

  let openCommitment = 0;
  let overdueCount = 0;
  let completedCount = 0;

  if (data && !isPending) {
    openCommitment = data
      .filter((po) => po.status !== "closed" && po.status !== "cancelled")
      .reduce((sum, po) => sum + po.total_amount, 0);
    overdueCount = data.filter((po) => po.status === "overdue").length;
    completedCount = data.filter((po) => po.status === "closed").length;
  }

  return (
    <StatStrip aria-label="Order totals">
      <StatCard
        label="Open commitment"
        value={
          isPending
            ? "..."
            : `$${openCommitment.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        }
        caption="Value of orders not yet closed"
      />
      <StatCard
        label="Overdue orders"
        value={isPending ? "..." : overdueCount}
        caption="Past their expected delivery date"
      />
      <StatCard
        label="Completed this month"
        value={isPending ? "..." : completedCount}
      />
    </StatStrip>
  );
}
