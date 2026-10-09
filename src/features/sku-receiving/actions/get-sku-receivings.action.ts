"use server";

import { createClient } from "@/src/db/supabaseClient";
import { getFilterDate } from "@/src/lib/date-range-utils";
import type { SkuReceivingItem, SkuReceivingQueryParams } from "../types";

const LIST_COLUMNS =
  "id, purchase_order_id, po_number, supplier_id, supplier_name, receipt_datetime, receiving_location, status, sku_count, qty_ordered, qty_received, qty_rejected, qty_expected";

export async function getSkuReceivingsAction(params: SkuReceivingQueryParams) {
  const supabase = await createClient();
  const { page, pageSize, search, filters } = params;
  // Characters that would break PostgREST's or() filter syntax.
  const searchTerm = search?.trim().replace(/[,()]/g, "");
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("sku_receivings_list")
    .select(LIST_COLUMNS, { count: "exact" })
    .order("receipt_datetime", { ascending: false })
    .order("id", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `po_number.ilike.%${searchTerm}%,supplier_name.ilike.%${searchTerm}%`,
    );
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const since = getFilterDate(filters?.dateRange);
  if (since) {
    query = query.gte("receipt_datetime", since);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch SKU receivings:", error);
    return { success: false, data: [], total: 0 };
  }

  return {
    success: true,
    data: (data ?? []) as SkuReceivingItem[],
    total: count ?? 0,
  };
}
