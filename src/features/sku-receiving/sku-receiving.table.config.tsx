import type { DataTableConfig } from "@/src/components/data-table/types";
import { isFilterPeriod } from "@/src/lib/date-range-utils";
import { setOrDeleteParam } from "@/src/lib/url-filter-utils";
import { skuReceivingFetcher } from "./fetchers/sku-receiving.fetcher";
import { skuReceivingTableColumns } from "./components/list/SkuReceivingColumns";
import SkuReceivingFilters from "./components/list/SkuReceivingFilters";
import { SKU_RECEIVING_STATUSES } from "./constants/statuses";
import type {
  SKUReceivingStatus,
  SkuReceivingFiltersValue,
  SkuReceivingItem,
  SkuReceivingQueryParams,
} from "./types";

const isSkuReceivingStatus = (
  value: string | null,
): value is SKUReceivingStatus =>
  SKU_RECEIVING_STATUSES.includes(value as SKUReceivingStatus);

export const skuReceivingTableConfig: DataTableConfig<
  SkuReceivingItem,
  SkuReceivingQueryParams,
  SkuReceivingFiltersValue
> = {
  fetcher: skuReceivingFetcher,
  queryKey: (params) => ["sku-receiving-table", params],
  filters: SkuReceivingFilters,
  columns: skuReceivingTableColumns,
  searchPlaceholder: "Search by PO# or supplier name...",

  parseFiltersFromUrl: (searchParams) => {
    const status = searchParams.get("status");
    const dateRange = searchParams.get("dateRange");
    return {
      status: isSkuReceivingStatus(status) ? status : undefined,
      dateRange: isFilterPeriod(dateRange) ? dateRange : undefined,
    };
  },
  writeFiltersToUrl: (filters, params) => {
    setOrDeleteParam(params, "status", filters.status);
    setOrDeleteParam(params, "dateRange", filters.dateRange);
  },
};
