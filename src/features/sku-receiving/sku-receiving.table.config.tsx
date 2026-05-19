import { skuReceivingFetcher } from "./fetchers/sku-receiving.fetcher";
import { skuReceivingTableColumns } from "@/src/features/sku-receiving/components/list/SkuReceivingColumns";
import { SkuReceivingItem } from "./types/domain.types";
import { DataTableConfig } from "@/src/components/data-table/types";
import SkuReceivingFilters from "@/src/features/sku-receiving/components/list/SkuReceivingFilters";
import {
  SkuReceivingQueryParams,
  SkuReceivingFiltersValue,
} from "@/src/features/sku-receiving/types/query.types";

export const skuReceivingTableConfig: DataTableConfig<
  SkuReceivingItem,
  SkuReceivingQueryParams,
  SkuReceivingFiltersValue
> = {
  fetcher: skuReceivingFetcher,
  queryKey: (params) => ["sku-receiving-table", params],
  filters: SkuReceivingFilters,
  columns: skuReceivingTableColumns,
  searchPlaceholder: "Search by SKU or item name...",
};
