import DataTable from "@/src/components/data-table/DataTable";
import { PurchaseOrdersTableConfig } from "@/src/features/purchase-orders/purchase-orders.table.config";
import type {
  PurchaseOrder,
  PurchaseOrdersQueryParams,
} from "../../types";
import { useRouter } from "next/navigation";

export default function PurchaseOrdersTable({
  filters,
  onFiltersChange,
}: {
  filters: { status?: string; dateRange?: string };
  onFiltersChange: (filters: { status?: string; dateRange?: string }) => void;
}) {
  // if (true) throw new Error("Test error boundary");
  const router = useRouter();
  // Pass filters as refreshKey to force update
  return (
    <DataTable<PurchaseOrder, PurchaseOrdersQueryParams>
      config={PurchaseOrdersTableConfig}
      refreshKey={JSON.stringify(filters)}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onRowClick={(row) => {
        router.push(`/purchase-orders/${row.id}`);
      }}
    />
  );
}
