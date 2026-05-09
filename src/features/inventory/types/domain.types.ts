// domain.types.ts
import type { StockStatus } from "./query.types";

export type InventoryItem = {
  id: string;
  itemName: string;
  skuCode: string;
  unit: string;
  initialStock: number;
  stockStatus: StockStatus;
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
  inventory_stock?:
    | { on_hand_qty: number; stock_status?: StockStatus }[]
    | { on_hand_qty: number; stock_status?: StockStatus }
    | null;
  sku_suppliers?: {
    supplier?: { name: string }[] | { name: string } | null;
  }[];
};
