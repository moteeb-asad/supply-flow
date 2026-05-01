// domain.types.ts
export type InventoryItem = {
  id: string;
  itemName: string;
  skuCode: string;
  unit: string;
  initialStock: number;
  unitPrice: number;
  category: string;
  primarySupplier: string;
};

export type RawInventoryItemRow = {
  id: string;
  sku_code: string;
  name: string;
  unit: string;
  standard_unit_price?: number;
  // Supabase can return these as either objects OR arrays
  categories?: { name: string }[] | { name: string } | null;
  inventory_stock?: { on_hand_qty: number }[] | { on_hand_qty: number } | null;
  sku_suppliers?: {
    supplier?: { name: string }[] | { name: string } | null;
  }[];
};
