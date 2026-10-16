// Same footprint as the KPI cards so nothing shifts when they stream in.
export default function DashboardKpisSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border border-line-soft bg-white px-4 py-3"
        >
          <div className="size-9 shrink-0 animate-pulse rounded-md bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-16 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
