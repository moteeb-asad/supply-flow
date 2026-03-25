import DataTable from "@/src/components/data-table/DataTable";
import { PurchaseOrdersTableConfig } from "@/src/features/purchase-orders/purchase-orders.table.config";
import type {
  PurchaseOrder,
  PurchaseOrdersQueryParams,
} from "../../types/purchase-orders.types";
import { useRouter } from "next/navigation";

export default function PurchaseOrdersTable({
  filters,
}: {
  filters: { status?: string; dateRange?: string };
}) {
  const router = useRouter();
  // Pass filters as refreshKey to force update
  return (
    <DataTable<PurchaseOrder, PurchaseOrdersQueryParams>
      config={PurchaseOrdersTableConfig}
      onRowClick={(row) => {
        router.push(`/purchase-orders/${row.id}`);
      }}
    />
  );
}
