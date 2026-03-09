import DataTable from "@/src/components/data-table/DataTable";
import { PurchaseOrdersTableConfig } from "../purchase-orders.table.config";
import type {
  PurchaseOrder,
  PurchaseOrdersQueryParams,
} from "../types/purchase-orders.types";

export default function PurchaseOrdersTableView() {
  return (
    <DataTable<PurchaseOrder, PurchaseOrdersQueryParams>
      config={PurchaseOrdersTableConfig}
    />
  );
}
