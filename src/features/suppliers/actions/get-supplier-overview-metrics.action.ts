"use server";

import { createServerSupabaseClient } from "@/src/db/supabaseServer";
import { getRequestTimezone } from "@/src/features/dashboard/server/request-timezone";
import type { SupplierOverviewMetrics } from "../types/suppliers.types";

// Metric cards for the suppliers list. All counting happens in
// get_supplier_overview_metrics; only a few numbers come back.
export async function getSupplierOverviewMetricsAction() {
  const supabase = await createServerSupabaseClient();
  const timezone = await getRequestTimezone();

  const { data, error } = await supabase
    .rpc("get_supplier_overview_metrics", { p_timezone: timezone })
    .single();

  if (error) {
    console.error("Failed to fetch supplier metrics:", error.message);
    return { success: false as const };
  }

  return { success: true as const, data: data as SupplierOverviewMetrics };
}
