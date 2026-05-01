"use client";

import getInventoryItemsAction from "../actions/get-inventory-items.action";
import { InventoryItemQueryParams } from "../types/query.types";

export async function inventoryItemsFetcher(params: InventoryItemQueryParams) {
  const result = await getInventoryItemsAction(params);
  if (!result.success) {
    throw new Error("Failed to fetch inventory items");
  }

  return {
    data: result.data,
    total: result.total,
  };
}
