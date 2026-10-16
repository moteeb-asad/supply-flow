import type { ReactNode } from "react";

// Card frame shared by the chart widget, its skeleton, and its empty/error states.
export default function SupplierPerformanceCard({
  legend,
  children,
}: {
  legend?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line-soft bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft px-4 py-3">
        <div>
          <h4 className="text-sm font-bold">Supplier Performance Trends</h4>
          <p className="text-[11px] text-muted">
            On-time delivery rate, last 8 weeks
          </p>
        </div>
        {legend}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
