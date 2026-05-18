"use server";

import { createClient } from "@/src/db/supabaseClient";
import {
  GetPurchaseOrderForReceivingInput,
  GetPurchaseOrderForReceivingResult,
  PurchaseOrderOption,
} from "../types";

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;

export async function getPurchaseOrderForReceivingAction(
  input: GetPurchaseOrderForReceivingInput = {},
): Promise<GetPurchaseOrderForReceivingResult> {
  const supabase = await createClient();
  const search = input.search?.trim();
  const limit = Math.min(Math.max(input.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = Math.max(input.offset ?? 0, 0);

  let query = supabase
    .from("purchase_orders")
    .select("id, po_number, supplier_id, expected_delivery_date, status")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("po_number", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getPurchaseOrderForReceivingAction error:", error.message);
    return {
      items: [],
      nextOffset: null,
    };
  }

  const items = (data ?? []) as PurchaseOrderOption[];
  return {
    items,
    nextOffset: items.length === limit ? offset + limit : null,
  };
}
