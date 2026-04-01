"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  GetPurchaseOrderSkusInput,
  PurchaseOrderSkuOption,
} from "../types";

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;

export async function getPurchaseOrderSkusAction(
  input: GetPurchaseOrderSkusInput = {},
): Promise<PurchaseOrderSkuOption[]> {
  const supabase = await createClient();
  const search = input.search?.trim();
  const limit = Math.min(Math.max(input.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);

  let query = supabase
    .from("skus")
    .select("id, sku_code, name, unit")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (search) {
    const pattern = `%${search.replace(/\s+/g, "%")}%`;
    query = query.or(`sku_code.ilike.${pattern},name.ilike.${pattern}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getPurchaseOrderSkusAction error:", error.message);
    return [];
  }

  return (data ?? []) as PurchaseOrderSkuOption[];
}
