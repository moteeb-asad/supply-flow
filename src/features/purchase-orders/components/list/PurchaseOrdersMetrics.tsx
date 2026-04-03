import { useQuery } from "@tanstack/react-query";
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg text-blue-700">
          <span className="material-symbols-outlined">payments</span>
        </div>
        <div>
          <p className="text-xs text-blue-700 font-bold uppercase">
            Open Commitment
          </p>
          <p className="text-xl font-black text-blue-900">
            {isPending
              ? "..."
              : `$${openCommitment.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          </p>
        </div>
      </div>
      <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-4">
        <div className="p-3 bg-red-100 rounded-lg text-red-700">
          <span className="material-symbols-outlined">running_with_errors</span>
        </div>
        <div>
          <p className="text-xs text-red-700 font-bold uppercase">
            Overdue Orders
          </p>
          <p className="text-xl font-black text-red-900">
            {isPending ? "..." : `${overdueCount} Orders`}
          </p>
        </div>
      </div>
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-4">
        <div className="p-3 bg-green-100 rounded-lg text-green-700">
          <span className="material-symbols-outlined">task_alt</span>
        </div>
        <div>
          <p className="text-xs text-green-700 font-bold uppercase">
            Completed (MTD)
          </p>
          <p className="text-xl font-black text-green-900">
            {isPending ? "..." : `${completedCount} Orders`}
          </p>
        </div>
      </div>
    </div>
  );
}
