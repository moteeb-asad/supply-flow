const bar = "animate-pulse rounded bg-background-light";

// Same footprint as SupplierCard so nothing shifts when the grid loads.
function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-card border border-line p-5">
      <div className="flex items-start justify-between">
        <div className={`size-10 rounded-control ${bar}`} />
        <div className={`h-[22px] w-16 rounded-full ${bar}`} />
      </div>
      <div className={`mt-4 h-4 w-3/4 ${bar}`} />
      <div className={`mt-1.5 h-3.5 w-1/3 ${bar}`} />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className={`h-9 ${bar}`} />
        <div className={`h-9 ${bar}`} />
      </div>
      <div className="mt-5 border-t border-line-soft pt-3">
        <div className={`h-3.5 w-1/2 ${bar}`} />
      </div>
    </div>
  );
}

export default function SupplierGridSkeleton({
  count = 8,
}: {
  count?: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
