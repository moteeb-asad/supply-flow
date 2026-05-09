import type { DataTableConfig } from "@/src/components/data-table/types";
import { purchaseOrdersFetcher } from "./fetchers/purchaseorders.fetcher";
import PurchaseOrdersFilters from "@/src/features/purchase-orders/components/list/PurchaseOrdersFilters";
import type {
  PurchaseOrder,
  PurchaseOrderStatus,
  PurchaseOrdersFiltersValue,
  PurchaseOrdersQueryParams,
} from "./types";
import { purchaseOrdersTableColumns } from "./components/list/PurchaseOrdersTableColumns";
import { setOrDeleteParam } from "@/src/lib/url-filter-utils";
import { isFilterPeriod } from "@/src/lib/date-range-utils";

const PURCHASE_ORDER_STATUSES: PurchaseOrderStatus[] = [
  "draft",
  "pending",
  "partially_received",
  "closed",
  "cancelled",
  "overdue",
];

const isPurchaseOrderStatus = (
  value: string | null,
): value is PurchaseOrderStatus =>
  value !== null &&
  PURCHASE_ORDER_STATUSES.includes(value as PurchaseOrderStatus);

const parsePurchaseOrdersFiltersFromUrl = (
  searchParams: URLSearchParams,
): PurchaseOrdersFiltersValue => {
  const dateRangeParam = searchParams.get("dateRange");
  const statusParam = searchParams.get("status");

  return {
    dateRange: isFilterPeriod(dateRangeParam) ? dateRangeParam : undefined,
    status: isPurchaseOrderStatus(statusParam) ? statusParam : undefined,
  };
};

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

  parseFiltersFromUrl: parsePurchaseOrdersFiltersFromUrl,
  writeFiltersToUrl: (filters, params) => {
    setOrDeleteParam(params, "dateRange", filters.dateRange);
    setOrDeleteParam(params, "status", filters.status);
  },
};
