import { StatCard } from "@/src/components/ui/StatCard";
import type { Permission, Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import { getDashboardMetrics } from "../server/get-dashboard-metrics";
import {
  formatCount,
  formatCurrency,
  getPercentChange,
} from "../utils/format";

type DashboardKpisProps = {
  role: Role | null;
};

// Async Server Component: rendered inside its own Suspense boundary so the
// rest of the dashboard never waits for these numbers.
export default async function DashboardKpis({ role }: DashboardKpisProps) {
  const metrics = await getDashboardMetrics();
  const value = (n: number | undefined, format = formatCount) =>
    metrics && n !== undefined ? format(Number(n)) : "—";

  const spendChange = metrics
    ? getPercentChange(
        Number(metrics.spend_mtd),
        Number(metrics.spend_prev_period),
      )
    : null;

  const cards: {
    permission: Permission;
    card: React.ComponentProps<typeof StatCard>;
  }[] = [
    {
      permission: "purchase_orders:view",
      card: {
        label: "Open Purchase Orders",
        icon: "description",
        value: value(metrics?.open_po_count),
        hint: metrics ? (
          <span className="text-xs font-medium text-muted">
            {formatCount(metrics.draft_po_count)} pending approval
          </span>
        ) : null,
      },
    },
    {
      permission: "receiving:view",
      card: {
        label: "Pending Deliveries",
        icon: "schedule",
        className: "border-transparent bg-primary shadow-lg shadow-primary/20",
        iconClassName: "bg-white/20 text-white",
        labelClassName: "text-white/80",
        valueClassName: "text-white",
        value: value(metrics?.pending_delivery_count),
        hint:
          metrics && metrics.urgent_delivery_count > 0 ? (
            <span className="rounded bg-white/20 px-1.5 py-0.5 text-xs font-bold text-white">
              {formatCount(metrics.urgent_delivery_count)} urgent
            </span>
          ) : null,
      },
    },
    {
      permission: "inventory:view",
      card: {
        label: "Low Stock Alerts",
        icon: "warning",
        iconClassName: "bg-danger/10 text-danger",
        valueClassName:
          metrics && metrics.low_stock_count > 0 ? "text-danger" : undefined,
        value: value(metrics?.low_stock_count),
        hint:
          metrics && metrics.critical_stock_count > 0 ? (
            <span className="text-xs font-bold text-danger">
              {formatCount(metrics.critical_stock_count)} critical
            </span>
          ) : null,
      },
    },
    {
      permission: "purchase_orders:view",
      card: {
        label: "Monthly Spend",
        icon: "payments",
        iconClassName: "bg-success/10 text-success",
        value: value(metrics?.spend_mtd, formatCurrency),
        hint:
          spendChange !== null ? (
            <span
              className={`text-xs font-medium ${
                spendChange >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {spendChange >= 0 ? "+" : ""}
              {spendChange.toFixed(1)}% vs last month
            </span>
          ) : null,
      },
    },
  ];

  const visibleCards = cards.filter(({ permission }) =>
    hasPermission(role, permission),
  );

  if (visibleCards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {visibleCards.map(({ card }) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
