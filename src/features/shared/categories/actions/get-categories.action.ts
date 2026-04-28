"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  GetCategoriesInput,
  GetCategoriesResult,
  SharedCategoryOption,
} from "../types";

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;

export async function getCategoriesAction(
  input: GetCategoriesInput = {},
): Promise<GetCategoriesResult> {
  const supabase = await createClient();
  const search = input.search?.trim();
  const limit = Math.min(Math.max(input.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = Math.max(input.offset ?? 0, 0);

  let query = supabase
    .from("categories")
    .select("id, name, description")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getCategoriesAction error:", error.message);
    return {
      items: [],
      nextOffset: null,
    };
  }

  const items = (data ?? []) as SharedCategoryOption[];
  return {
    items,
    nextOffset: items.length === limit ? offset + limit : null,
  };
}
