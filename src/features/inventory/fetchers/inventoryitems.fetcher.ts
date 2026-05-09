"use client";

import getInventoryItemsAction from "../actions/get-inventory-items.action";
import { InventoryItemFiltersValue } from "../types/query.types";

export async function inventoryItemsFetcher(params: {
  page: number;
  pageSize: number;
  search?: string;
  filters?: InventoryItemFiltersValue;
}) {
  const { page, pageSize, search, filters } = params;
  const result = await getInventoryItemsAction({
    page,
    pageSize,
    search,
    filters,
  });
  if (!result.success) {
    throw new Error("Failed to fetch inventory items");
  }

  if (result.success) {
    return {
      data: result.data,
      total: result.total,
    };
  }

  return {
    data: [],
    total: 0,
  };
}
