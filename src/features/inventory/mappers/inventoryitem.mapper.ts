import type { InventoryItem, RawInventoryItemRow } from "../types/domain.types";

export function mapInventoryItem(row: RawInventoryItemRow): InventoryItem {
  return {
    id: row.id,
    itemName: row.name,
    skuCode: row.sku_code,
    unit: row.unit,
    category:
      Array.isArray(row.categories) && row.categories.length > 0
        ? row.categories[0].name
        : "",
    initialStock:
      Array.isArray(row.inventory_stock) && row.inventory_stock.length > 0
        ? row.inventory_stock[0].on_hand_qty
        : 0,
    unitPrice: row.unit_price ?? 0,
    primarySupplier: row.primary_supplier ?? "",
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
  };
}
