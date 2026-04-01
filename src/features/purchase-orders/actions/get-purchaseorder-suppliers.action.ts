"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  GetPurchaseOrderSuppliersInput,
  PurchaseOrderSupplierOption,
} from "../types";

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;

export async function getPurchaseOrderSuppliersAction(
  input: GetPurchaseOrderSuppliersInput = {},
): Promise<PurchaseOrderSupplierOption[]> {
  const supabase = await createClient();
  const search = input.search?.trim();
  const limit = Math.min(Math.max(input.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);

  let query = supabase
    .from("suppliers")
    .select("id, name, category, status")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getPurchaseOrderSuppliersAction error:", error.message);
    return [];
  }

  return (data ?? []) as PurchaseOrderSupplierOption[];
}
