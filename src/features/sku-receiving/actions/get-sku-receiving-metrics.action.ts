"use server";

import { createClient } from "@/src/db/supabaseClient";
import type {
  SkuReceivingMetrics,
  SkuReceivingMetricsInput,
} from "../types/query.types";

export async function getSkuReceivingMetricsAction({
  dayStart,
  monthStart,
}: SkuReceivingMetricsInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("get_sku_receiving_metrics", {
      p_day_start: dayStart,
      p_month_start: monthStart,
    })
    .single();

  if (error) {
    console.error("Failed to fetch SKU receiving metrics:", error);
    return { success: false as const };
  }

  return { success: true as const, data: data as SkuReceivingMetrics };
}
