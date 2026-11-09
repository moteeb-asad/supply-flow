import { StatCard, StatStrip } from "@/src/components/ui/StatCard";
import { StatusPill } from "@/src/components/ui/StatusPill";
import type { Permission, Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import { formatMonth } from "@/src/lib/dates";
import { getDashboardMetrics } from "../../server/get-dashboard-metrics";
import { getRequestTimezone } from "../../server/request-timezone";
import {
  formatCount,
  formatCurrency,
  getPercentChange,
} from "../../utils/format";

type DashboardKpisProps = {
  role: Role | null;
};

// Async Server Component: rendered inside its own Suspense boundary
// so the rest of the dashboard never waits for these numbers.
export default async function DashboardKpis({ role }: DashboardKpisProps) {
  // 1. Evaluate permissions before executing requests.
  const canViewPurchaseOrders = hasPermission(role, "purchase_orders:view");
  const canViewReceiving = hasPermission(role, "receiving:view");
  const canViewInventory = hasPermission(role, "inventory:view");

  // 2. Return early if the user cannot access any KPI cards.
  if (!canViewPurchaseOrders && !canViewReceiving && !canViewInventory) {
    return null;
  }

  // 3. Fetch independent data concurrently.
  // Timezone is only needed for purchase-order KPIs.
  const [metricsResult, timezoneResult] = await Promise.allSettled([
    getDashboardMetrics(),
    canViewPurchaseOrders ? getRequestTimezone() : Promise.resolve(null),
  ]);

  // 4. Handle failures independently.
  const metrics =
    metricsResult.status === "fulfilled" ? metricsResult.value : null;

  const timezone =
    timezoneResult.status === "fulfilled" ? timezoneResult.value : null;

  if (metricsResult.status === "rejected") {
    console.error("Failed to fetch dashboard metrics:", metricsResult.reason);
  }

  if (timezoneResult.status === "rejected") {
    console.error("Failed to fetch dashboard timezone:", timezoneResult.reason);
  }

  const value = (n: number | undefined, format = formatCount) =>
    metrics && n !== undefined ? format(Number(n)) : "—";

  const spendChange = metrics
    ? getPercentChange(
        Number(metrics.spend_mtd),
        Number(metrics.spend_prev_period),
      )
    : null;

  const drafts = Number(metrics?.draft_po_count ?? 0);

  const month = timezone ? formatMonth(new Date(), timezone) : null;

  const cards: {
    permission: Permission;
    card: React.ComponentProps<typeof StatCard>;
  }[] = [
    {
      permission: "purchase_orders:view",
      card: {
        label: "Open purchase orders",
        value: value(metrics?.open_po_count),
        caption: metrics
          ? drafts > 0
            ? `${formatCount(drafts)} ${drafts === 1 ? "draft" : "drafts"} waiting for approval`
            : "No drafts waiting for approval"
          : null,
      },
    },
    {
      permission: "receiving:view",
      card: {
        label: "Pending deliveries",
        value: value(metrics?.pending_delivery_count),
        hint:
          metrics && metrics.urgent_delivery_count > 0 ? (
            <StatusPill tone="danger">
              {formatCount(metrics.urgent_delivery_count)} urgent
            </StatusPill>
          ) : null,
        caption: "Waiting to be received",
      },
    },
    {
      permission: "inventory:view",
      card: {
        label: "Low stock alerts",
        value: value(metrics?.low_stock_count),
        hint:
          metrics && metrics.critical_stock_count > 0 ? (
            <StatusPill tone="danger">
              {formatCount(metrics.critical_stock_count)} critical
            </StatusPill>
          ) : null,
        caption: "Below their reorder level",
      },
    },
    {
      permission: "purchase_orders:view",
      card: {
        label: "Monthly spend",
        value: value(metrics?.spend_mtd, formatCurrency),
        hint:
          spendChange !== null ? (
            <StatusPill tone={spendChange >= 0 ? "success" : "danger"}>
              {spendChange >= 0 ? "+" : ""}
              {spendChange.toFixed(1)}% vs last month
            </StatusPill>
          ) : null,
        caption: `${month ? `${month}, ` : ""}month to date`,
      },
    },
  ];

  const visibleCards = cards.filter(({ permission }) =>
    hasPermission(role, permission),
  );

  if (visibleCards.length === 0) return null;

  return (
    <StatStrip aria-label="Key numbers">
      {visibleCards.map(({ card }) => (
        <StatCard key={card.label} {...card} />
      ))}
    </StatStrip>
  );
}
