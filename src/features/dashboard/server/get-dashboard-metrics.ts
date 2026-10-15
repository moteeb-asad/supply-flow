import { headers } from "next/headers";
import { createClient } from "@/src/db/supabaseClient";
import type { DashboardMetrics } from "../types";

// Server-only loader for the KPI widget (called from a Server Component, not a
// server action, so widgets load in parallel instead of queueing).
export async function getDashboardMetrics(): Promise<DashboardMetrics | null> {
  const supabase = await createClient();
  // Vercel sets the visitor's IANA timezone; the SQL function falls back to UTC.
  const timezone = (await headers()).get("x-vercel-ip-timezone") ?? "UTC";

  const { data, error } = await supabase
    .rpc("get_dashboard_metrics", { p_timezone: timezone })
    .single();

  if (error) {
    console.error("Failed to fetch dashboard metrics:", error.message);
    return null;
  }

  return data as DashboardMetrics;
}
