"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  GetActiveSuppliersInput,
  GetActiveSuppliersResult,
  SharedSupplierOption,
} from "@/src/features/shared/suppliers/types";

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;

export async function getActiveSuppliersAction(
  input: GetActiveSuppliersInput = {},
): Promise<GetActiveSuppliersResult> {
  const supabase = await createClient();
  const search = input.search?.trim();
  const limit = Math.min(Math.max(input.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = Math.max(input.offset ?? 0, 0);

  let query = supabase
    .from("suppliers")
    .select("id, name, category, status")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getActiveSuppliersAction error:", error.message);
    return {
      items: [],
      nextOffset: null,
    };
  }

  const items = (data ?? []) as SharedSupplierOption[];
  return {
    items,
    nextOffset: items.length === limit ? offset + limit : null,
  };
}
