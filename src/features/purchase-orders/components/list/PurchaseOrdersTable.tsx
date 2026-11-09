import DataTable from "@/src/components/data-table/core/DataTable";
import { PurchaseOrdersTableConfig } from "@/src/features/purchase-orders/purchase-orders.table.config";
import type {
  PurchaseOrder,
  PurchaseOrdersFiltersValue,
  PurchaseOrdersQueryParams,
} from "../../types";
import { useRouter } from "next/navigation";

export default function PurchaseOrdersTable({
  filters,
  onFiltersChange,
  resetPageKey,
  tabs,
}: {
  filters: PurchaseOrdersFiltersValue;
  onFiltersChange: (filters: PurchaseOrdersFiltersValue) => void;
  resetPageKey?: number;
  tabs?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <DataTable<
      PurchaseOrder,
      PurchaseOrdersQueryParams,
      PurchaseOrdersFiltersValue
    >
      config={PurchaseOrdersTableConfig}
      refreshKey={JSON.stringify(filters)}
      filters={filters}
      onFiltersChange={onFiltersChange}
      resetPageKey={resetPageKey}
      tabs={tabs}
      className="p-0"
      onRowClick={(row) => {
        router.push(`/purchase-orders/${row.id}`);
      }}
    />
  );
}
