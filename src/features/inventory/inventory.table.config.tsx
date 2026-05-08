import type { DataTableConfig } from "@/src/components/data-table/types";
import type { InventoryItem } from "./types/domain.types";
import type {
  InventoryItemFiltersValue,
  InventoryItemQueryParams,
  StockStatus,
} from "./types/query.types";
import { inventoryItemsFetcher } from "./fetchers/inventoryitems.fetcher";
import InventoryTableFilters from "@/src/features/inventory/components/list/InventoryTableFilters";
import { inventoryTableColumns } from "./components/list/InventoryTableColumns";

const isStockStatus = (value: string | null): value is StockStatus =>
  value === "good" || value === "low" || value === "critical";

const parseNumberParam = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseInventoryFiltersFromUrl = (
  searchParams: URLSearchParams,
): InventoryItemFiltersValue => {
  const stockStatusParam = searchParams.get("stockStatus");
  const categoryParam = searchParams.get("category");
  const minPriceParam = parseNumberParam(searchParams.get("minPrice"));
  const maxPriceParam = parseNumberParam(searchParams.get("maxPrice"));

  return {
    stockStatus: isStockStatus(stockStatusParam) ? stockStatusParam : undefined,
    categoryName: categoryParam || undefined,
    unitPriceMin: minPriceParam,
    unitPriceMax: maxPriceParam,
  };
};

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

  parseFiltersFromUrl: parseInventoryFiltersFromUrl,

  writeFiltersToUrl: (filters, params) => {
    if (filters.stockStatus) {
      params.set("stockStatus", filters.stockStatus);
    } else {
      params.delete("stockStatus");
    }

    if (filters.categoryName) {
      params.set("category", filters.categoryName);
    } else {
      params.delete("category");
    }

    if (typeof filters.unitPriceMin === "number") {
      params.set("minPrice", String(filters.unitPriceMin));
    } else {
      params.delete("minPrice");
    }

    if (typeof filters.unitPriceMax === "number") {
      params.set("maxPrice", String(filters.unitPriceMax));
    } else {
      params.delete("maxPrice");
    }
  },
};
