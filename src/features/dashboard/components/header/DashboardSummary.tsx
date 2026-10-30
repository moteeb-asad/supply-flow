import type { Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import { getDashboardMetrics } from "../../server/get-dashboard-metrics";
import { formatCount } from "../../utils/format";

const plural = (count: number, one: string, many: string) =>
  `${formatCount(count)} ${count === 1 ? one : many}`;

// One line under the greeting, built from the same (cached) metrics as the
// KPI strip and limited to what the user's role can see.
export default async function DashboardSummary({
  role,
}: {
  role: Role | null;
}) {
  const metrics = await getDashboardMetrics();

  if (!metrics) {
    return (
      <p className="mt-1 text-sm text-muted">
        Here&apos;s what&apos;s happening in your warehouse today.
      </p>
    );
  }

  const parts: string[] = [];
  const urgent = Number(metrics.urgent_delivery_count);
  const lowStock = Number(metrics.low_stock_count);

  if (hasPermission(role, "receiving:view") && urgent > 0) {
    parts.push(
      `${plural(urgent, "delivery is", "deliveries are")} marked urgent`,
    );
  }
  if (hasPermission(role, "inventory:view") && lowStock > 0) {
    parts.push(`${plural(lowStock, "item is", "items are")} running low`);
  }

  return (
    <p className="mt-1 text-sm text-muted">
      {parts.length > 0
        ? `${parts.join(" and ")}.`
        : "Nothing needs your attention right now."}
    </p>
  );
}
