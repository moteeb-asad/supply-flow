import type { ReactNode } from "react";

// Card frame shared by the chart widget, its skeleton, and its empty/error
// states. `legend` is the per-supplier latest rate row above the chart.
export default function SupplierPerformanceCard({
  legend,
  children,
}: {
  legend?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby="supplier-on-time-title"
      className="h-full min-w-0 rounded-card border border-line"
    >
      <div className="px-5 pt-4">
        <h2 id="supplier-on-time-title" className="text-[15px] font-semibold">
          Supplier on-time delivery
        </h2>
        <p className="mt-0.5 text-[13px] text-subtle">
          Share of deliveries that arrived by the expected date, last 8 weeks
        </p>
      </div>
      {legend}
      {children}
    </section>
  );
}
