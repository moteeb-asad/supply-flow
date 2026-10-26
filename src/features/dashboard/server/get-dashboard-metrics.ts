import { createServerSupabaseClient } from "@/src/db/supabaseServer";
import type { DashboardMetrics } from "../types";
import { getRequestTimezone } from "./request-timezone";

// Server-only loader for the KPI widget (called from a Server Component, not a
// server action, so widgets load in parallel instead of queueing).
export async function getDashboardMetrics(): Promise<DashboardMetrics | null> {
  const supabase = await createServerSupabaseClient();
  const timezone = await getRequestTimezone();

  const { data, error } = await supabase
    .rpc("get_dashboard_metrics", { p_timezone: timezone })
    .single();

  if (error) {
    console.error("Failed to fetch dashboard metrics:", error.message);
    return null;
  }

  return data as DashboardMetrics;
}
