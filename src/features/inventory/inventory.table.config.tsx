import type { DataTableConfig } from "@/src/components/data-table/types";
import type { InventoryItem } from "./types/domain.types";
import type {
  InventoryItemFiltersValue,
  InventoryItemQueryParams,
} from "./types/query.types";
import { inventoryItemsFetcher } from "./fetchers/inventoryitems.fetcher";
import InventoryTableFilters from "@/src/features/inventory/components/list/InventoryTableFilters";
import { inventoryTableColumns } from "./components/list/InventoryTableColumns";

export const InventoryTableConfig: DataTableConfig<
  InventoryItem,
  InventoryItemQueryParams,
  InventoryItemFiltersValue
> = {
  fetcher: inventoryItemsFetcher,
  queryKey: (params) => ["inventory-table", params],
  filters: InventoryTableFilters,
  columns: inventoryTableColumns,
  searchPlaceholder: "Search by SKU or item name...",
};
