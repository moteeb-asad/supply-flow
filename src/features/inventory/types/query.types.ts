export type StockStatus = "good" | "low" | "critical";

export type InventoryItemQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: InventoryItemFiltersValue;
};

export type InventoryItemFiltersValue = {
  category?: string;
  stockStatus?: StockStatus;
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
