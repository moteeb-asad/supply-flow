"use server";

import { createClient } from "@/src/db/supabaseClient";
import { InventoryItemQueryParams } from "../types/query.types";
import { mapInventoryItem } from "../mappers/inventoryitem.mapper";

export default async function getInventoryItemsAction(
  params: InventoryItemQueryParams,
) {
  const supabase = await createClient();
  const { page, pageSize, search } = params;
  const searchTerm = search?.trim();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

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
        inventory_stock(on_hand_qty)
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `name.ilike.%${searchTerm}%,sku_code.ilike.%${searchTerm}%`,
    );
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
