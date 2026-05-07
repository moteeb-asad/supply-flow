import type { DataTableConfig } from "@/src/components/data-table/types";
import { purchaseOrdersFetcher } from "./fetchers/purchaseorders.fetcher";
import PurchaseOrdersFilters from "@/src/features/purchase-orders/components/list/PurchaseOrdersFilters";
import type {
  PurchaseOrder,
  PurchaseOrdersFiltersValue,
  PurchaseOrdersQueryParams,
} from "./types";

import { purchaseOrdersTableColumns } from "./components/list/PurchaseOrdersTableColumns";

export const PurchaseOrdersTableConfig: DataTableConfig<
  PurchaseOrder,
  PurchaseOrdersQueryParams,
  PurchaseOrdersFiltersValue
> = {
  fetcher: purchaseOrdersFetcher,
  queryKey: (params) => ["purchase-orders-table", params],
  rowHref: (row) => `/purchase-orders/${row.id}`,
  filters: PurchaseOrdersFilters,
  columns: purchaseOrdersTableColumns,
  searchPlaceholder: "Search by PO# or Supplier name...",
};
