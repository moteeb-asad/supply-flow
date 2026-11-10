export type StockStatus = "good" | "low" | "critical";

export type InventoryItemQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: InventoryItemFiltersValue;
};

export type InventoryItemFiltersValue = {
  category?: string;
  categoryName?: string;
  stockStatus?: StockStatus;
  unitPriceMin?: number;
  unitPriceMax?: number;
};

export type InventoryItemRow = {
  id: string;
  skuCode: string;
  itemName: string;
  unit: string;
  category: string;
  initialStock: number;
  unitPrice: number;
  primarySupplier: string;
};

// Row returned by get_inventory_metrics (migration 049). numeric comes back
// from PostgREST as a string or number, so callers wrap it in Number().
export type InventoryMetrics = {
  total_stock_value: number | string;
  low_stock_count: number;
  out_of_stock_count: number;
};
