import { StatStrip } from "@/src/components/ui/StatCard";

// Same footprint as the KPI strip so nothing shifts when it streams in.
export default function DashboardKpisSkeleton() {
  return (
    <StatStrip>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="space-y-3 bg-surface p-5">
          <div className="h-3.5 w-28 animate-pulse rounded bg-background-light" />
          <div className="h-9 w-16 animate-pulse rounded bg-background-light" />
          <div className="h-3.5 w-36 animate-pulse rounded bg-background-light" />
        </div>
      ))}
    </StatStrip>
  );
}
