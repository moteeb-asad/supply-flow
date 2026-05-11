"use server";

import { createClient } from "@/src/db/supabaseClient";
import { InventoryItemQueryParams } from "../types/query.types";
import { mapInventoryItem } from "../mappers/inventoryitem.mapper";

export default async function getInventoryItemsAction(
  params: InventoryItemQueryParams,
) {
  const supabase = await createClient();
  const { page, pageSize, search, filters } = params;
  const searchTerm = search?.trim();
  const selectedStockStatus = filters?.stockStatus;
  let selectedCategoryId = filters?.category;
  const minPrice = filters?.unitPriceMin;
  const maxPrice = filters?.unitPriceMax;

  if (!selectedCategoryId && filters?.categoryName) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("name", filters.categoryName)
      .limit(1)
      .maybeSingle();

    selectedCategoryId = categoryData?.id;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const inventoryStockSelect = selectedStockStatus
    ? "inventory_stock!inner(stock_status, on_hand_qty)"
    : "inventory_stock(stock_status, on_hand_qty)";

  let query = supabase
    .from("skus")
    .select(
      `
        id,
        sku_code,
        name,
        unit,
        standard_unit_price,
        categories:category_id (name),
        sku_suppliers(supplier:supplier_id(name)),
        ${inventoryStockSelect}
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  // Apply search filter if search term is provided
  if (searchTerm) {
    query = query.or(
      `name.ilike.%${searchTerm}%,sku_code.ilike.%${searchTerm}%`,
    );
  }

  // Apply stock status filter if selected
  if (selectedStockStatus) {
    query = query.eq("inventory_stock.stock_status", selectedStockStatus);
  }

  // Apply category filter if selected
  if (selectedCategoryId) {
    query = query.eq("category_id", selectedCategoryId);
  }

  // Apply unit price range filter if provided
  if (typeof minPrice === "number" && typeof maxPrice === "number") {
    const low = Math.min(minPrice, maxPrice);
    const high = Math.max(minPrice, maxPrice);
    query = query
      .gte("standard_unit_price", low)
      .lte("standard_unit_price", high);
  } else if (typeof minPrice === "number") {
    query = query.gte("standard_unit_price", minPrice);
  } else if (typeof maxPrice === "number") {
    query = query.lte("standard_unit_price", maxPrice);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch inventory items:", error);
    return { success: false, data: [], total: 0 };
  }

  return {
    success: true,
    data: (data ?? []).map(mapInventoryItem),
    total: count ?? 0,
  };
}
