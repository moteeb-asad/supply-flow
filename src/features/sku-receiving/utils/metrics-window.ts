import type { SkuReceivingMetricsInput } from "../types/query.types";

// Start of the user's local day and month as UTC ISO strings, so "today" and
// "MTD" follow the user's clock rather than the database's UTC day.
export function getMetricsWindow(now = new Date()): SkuReceivingMetricsInput {
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    dayStart: dayStart.toISOString(),
    monthStart: monthStart.toISOString(),
  };
}
