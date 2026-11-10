"use server";

import { createServerSupabaseClient } from "@/src/db/supabaseServer";
import type { InventoryMetrics } from "../types/query.types";

// Metric cards for the inventory screen. All counting happens in
// get_inventory_metrics; only three numbers come back.
export async function getInventoryMetricsAction() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.rpc("get_inventory_metrics").single();

  if (error) {
    console.error("Failed to fetch inventory metrics:", error.message);
    return { success: false as const };
  }

  return { success: true as const, data: data as InventoryMetrics };
}
