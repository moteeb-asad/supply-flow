"use server";

import { createClient } from "@/src/db/supabaseClient";
import { SkuReceivingQueryParams } from "../types/query.types";

export default async function getSkuReceivingsAction(
  params: SkuReceivingQueryParams,
) {
  const supabase = await createClient();
  const { page, pageSize, search, filters } = params;
  const searchTerm = search?.trim();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Apply search filter if search term is provided
  // if (searchTerm) {
  //   query = query.or(
  //     `name.ilike.%${searchTerm}%,sku_code.ilike.%${searchTerm}%`,
  //   );
  // }

  // const { data, count, error } = await query.range(from, to);

  // if (error) {
  //   console.error("Failed to fetch inventory items:", error);
  //   return { success: false, data: [], total: 0 };
  // }

  return {
    success: true,
    data: [],
    total: 0,
  };
}
