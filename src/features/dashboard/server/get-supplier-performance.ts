import { createClient } from "@/src/db/supabaseClient";
import type {
  SupplierPerformanceRow,
  SupplierPerformanceTrends,
} from "../types";
import { getRequestTimezone } from "./request-timezone";

const WEEKS = 8;
const TOP_SUPPLIERS = 3;

const weekLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

// Server-only loader: the SQL function does all aggregation and returns at most
// TOP_SUPPLIERS x WEEKS rows; this only reshapes them for the chart.
export async function getSupplierPerformance(): Promise<SupplierPerformanceTrends | null> {
  const supabase = await createClient();
  const timezone = await getRequestTimezone();

  const { data, error } = await supabase.rpc(
    "get_supplier_performance_trends",
    { p_timezone: timezone, p_weeks: WEEKS, p_suppliers: TOP_SUPPLIERS },
  );

  if (error) {
    console.error("Failed to fetch supplier performance:", error.message);
    return null;
  }

  const rows = (data ?? []) as SupplierPerformanceRow[];
  const weeks = [...new Set(rows.map((row) => row.week_start))];
  const bySupplier = new Map<string, SupplierPerformanceRow[]>();

  for (const row of rows) {
    const supplierRows = bySupplier.get(row.supplier_id) ?? [];
    supplierRows.push(row);
    bySupplier.set(row.supplier_id, supplierRows);
  }

  return {
    // week_start is a plain date; format it as UTC so it never shifts a day.
    labels: weeks.map((week) =>
      weekLabelFormatter.format(new Date(`${week}T00:00:00Z`)),
    ),
    series: [...bySupplier.values()].map((supplierRows) => ({
      name: supplierRows[0].supplier_name ?? "Unknown Supplier",
      values: supplierRows.map((row) =>
        row.deliveries > 0
          ? Math.round((row.on_time_deliveries / row.deliveries) * 100)
          : null,
      ),
    })),
  };
}
