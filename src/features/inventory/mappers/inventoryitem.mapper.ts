// inventoryitem.mapper.ts
import type { InventoryItem, RawInventoryItemRow } from "../types/domain.types";

export function mapInventoryItem(row: RawInventoryItemRow): InventoryItem {
  // Helper to extract name from categories (handles both object and array)
  const getCategory = (): string => {
    if (!row.categories) return "";
    if (Array.isArray(row.categories)) {
      return row.categories.length > 0 ? row.categories[0].name : "";
    }
    return row.categories.name;
  };

  // Helper to extract stock (handles both object and array)
  const getStock = (): number => {
    if (!row.inventory_stock) return 0;
    if (Array.isArray(row.inventory_stock)) {
      return row.inventory_stock.length > 0
        ? row.inventory_stock[0].on_hand_qty
        : 0;
    }
    return row.inventory_stock.on_hand_qty;
  };

  // Helper to extract supplier (handles both object and array)
  const getSupplier = (): string => {
    if (!row.sku_suppliers || row.sku_suppliers.length === 0) return "";
    const firstSupplier = row.sku_suppliers[0].supplier;
    if (!firstSupplier) return "";
    if (Array.isArray(firstSupplier)) {
      return firstSupplier.length > 0 ? firstSupplier[0].name : "";
    }
    return firstSupplier.name;
  };

  return {
    id: row.id,
    itemName: row.name,
    skuCode: row.sku_code,
    unit: row.unit,
    unitPrice: row.standard_unit_price ?? 0,
    category: getCategory(),
    initialStock: getStock(),
    primarySupplier: getSupplier(),
  };
}
