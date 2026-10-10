import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/src/components/ui/StatCard";
import { purchaseOrdersFetcher } from "@/src/features/purchase-orders/fetchers/purchaseorders.fetcher";
import type { PurchaseOrder } from "@/src/features/purchase-orders/types";

export default function PurchaseOrdersMetrics() {
  const { data, isPending } = useQuery({
    queryKey: ["purchase-orders-metrics"],
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        label="Open Commitment"
        icon="payments"
        className="border-blue-100 bg-blue-50"
        iconClassName="bg-blue-100 text-blue-700"
        labelClassName="text-blue-700"
        valueClassName="text-blue-900"
        value={
          isPending
            ? "..."
            : `$${openCommitment.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        }
      />
      <StatCard
        label="Overdue Orders"
        icon="running_with_errors"
        className="border-red-100 bg-red-50"
        iconClassName="bg-red-100 text-red-700"
        labelClassName="text-red-700"
        valueClassName="text-red-900"
        value={isPending ? "..." : `${overdueCount} Orders`}
      />
      <StatCard
        label="Completed (MTD)"
        icon="task_alt"
        className="border-green-100 bg-green-50"
        iconClassName="bg-green-100 text-green-700"
        labelClassName="text-green-700"
        valueClassName="text-green-900"
        value={isPending ? "..." : `${completedCount} Orders`}
      />
    </div>
  );
}
