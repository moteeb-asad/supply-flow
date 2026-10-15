import { createClient } from "@/src/db/supabaseClient";
import type { RecentReceivingActivityItem } from "../types";

const RECENT_ACTIVITY_LIMIT = 5;

// Server-only loader for the recent receiving widget (latest SKU lines).
export async function getRecentReceivingActivity(): Promise<
  RecentReceivingActivityItem[] | null
> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_recent_receiving_activity", {
    p_limit: RECENT_ACTIVITY_LIMIT,
  });

  if (error) {
    console.error("Failed to fetch recent receiving activity:", error.message);
    return null;
  }

  return (data ?? []) as RecentReceivingActivityItem[];
}
