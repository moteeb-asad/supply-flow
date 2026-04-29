export type InventoryItemQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: InventoryItemFiltersValue;
};

export type InventoryItemFiltersValue = {
  status?: string;
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
