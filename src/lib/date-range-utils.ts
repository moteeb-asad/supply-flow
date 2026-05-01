/**
 * Date filtering utility for Supabase queries.
 * Works with both date columns (order_date) and timestamp columns (last_login_at).
 *
 * Usage:
 *   const filterDate = getFilterDate("last_7_days");
 *   query.gte("last_login_at", filterDate);
 *   query.gte("order_date", filterDate);
 */

export type FilterPeriod =
  | "last_24_hours"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "this_quarter";

/**
 * Returns the ISO date string for the start of the selected filter period.
 * @param period The filter period (e.g., "last_7_days", "this_month").
 * @returns ISO timestamp string (e.g., "2026-04-16T15:30:45.123Z") or null if no period.
 */
export function getFilterDate(period?: FilterPeriod): string | null {
  if (!period) return null;

  const now = new Date();
  let filterDate: Date;

  switch (period) {
    case "last_24_hours":
      filterDate = new Date(now);
      filterDate.setDate(now.getDate() - 1);
      break;
    case "last_7_days":
      filterDate = new Date(now);
      filterDate.setDate(now.getDate() - 7);
      break;
    case "last_30_days":
      filterDate = new Date(now);
      filterDate.setDate(now.getDate() - 30);
      break;
    case "this_month":
      filterDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "this_quarter": {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      filterDate = new Date(now.getFullYear(), quarterStartMonth, 1);
      break;
    }
    default:
      return null;
  }
  return filterDate.toISOString();
}
