"use server";

import { createServerSupabaseClient } from "@/src/db/supabaseServer";
import { getRequestTimezone } from "@/src/features/dashboard/server/request-timezone";
import type { PurchaseOrderMetrics } from "../types";

// Metric cards for the purchase orders list. All counting happens in
// get_purchase_order_metrics; only three numbers come back.
export async function getPurchaseOrderMetricsAction() {
  const supabase = await createServerSupabaseClient();
  const timezone = await getRequestTimezone();

  const { data, error } = await supabase
    .rpc("get_purchase_order_metrics", { p_timezone: timezone })
    .single();

  if (error) {
    console.error("Failed to fetch purchase order metrics:", error.message);
    return { success: false as const };
  }

  return { success: true as const, data: data as PurchaseOrderMetrics };
}
