export type InventoryItem = {
  id: string;
  itemName: string;
  skuCode: string;
  unit: string;
  initialStock: number;
  unitPrice: number;
  category: string;
  primarySupplier: string;
  createdAt: string;
  updatedAt: string;
};

export type RawInventoryItemRow = {
  id: string;
  sku_code: string;
  name: string;
  unit: string;
  categories?: { name: string }[];
  inventory_stock?: { on_hand_qty: number }[];
  unit_price?: number;
  primary_supplier?: string;
  created_at?: string;
  updated_at?: string;
};
