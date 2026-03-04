"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  Supplier,
  SuppliersPage,
} from "@/src/features/suppliers/types/suppliers.types";
import {
  SUPPLIERS_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "@/src/features/suppliers/constants/pagination";
import type { GetSuppliersInput } from "@/src/features/suppliers/types/suppliers.types";

export async function getSuppliersAction(
  input: GetSuppliersInput = {},
): Promise<SuppliersPage> {
  const supabase = await createClient();
  const pageSize = Math.min(
    Math.max(input.limit ?? SUPPLIERS_PAGE_SIZE, 1),
    MAX_PAGE_SIZE,
  );

  let query = supabase
    .from("suppliers")
    .select(
      [
        "id",
        "name",
        "category",
        "status",
        "primary_contact_name",
        "primary_contact_email",
        "primary_contact_phone",
        "payment_terms",
        "min_order_qty",
        "lead_time_days",
        "notes",
        "created_at",
      ].join(","),
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(pageSize + 1);

  if (input.cursor?.createdAt) {
    query = query.or(
      `created_at.lt.${input.cursor.createdAt},and(created_at.eq.${input.cursor.createdAt},id.lt.${input.cursor.id})`,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("getSuppliersAction error:", error.message);
    return { suppliers: [], hasMore: false, nextCursor: null };
  }

  const items = (data ?? []) as unknown as Supplier[];
  const hasMore = items.length > pageSize;
  const suppliers = hasMore ? items.slice(0, pageSize) : items;
  const lastItem = suppliers[suppliers.length - 1];

  const nextCursor = lastItem?.created_at
    ? { createdAt: lastItem.created_at, id: lastItem.id }
    : null;

  return { suppliers, hasMore, nextCursor };
}
