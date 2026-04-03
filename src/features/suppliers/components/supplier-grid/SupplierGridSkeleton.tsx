function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 p-5 gap-4">
      <div className="flex items-start justify-between">
        <div className="size-14 rounded-lg bg-slate-200 animate-pulse"></div>
        <div className="h-6 w-16 rounded-full bg-slate-100 animate-pulse"></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-5 w-3/4 rounded bg-slate-200 animate-pulse"></div>
        <div className="h-4 w-1/2 rounded bg-slate-100 animate-pulse"></div>
      </div>
      <div className="flex flex-col gap-3 pt-2 border-t border-slate-50">
        <div className="flex justify-between items-end h-12 gap-1">
          <div className="flex-1 bg-slate-100 rounded-t-sm h-[60%] animate-pulse"></div>
          <div className="flex-1 bg-slate-100 rounded-t-sm h-[80%] animate-pulse"></div>
          <div className="flex-1 bg-slate-200 rounded-t-sm h-[100%] animate-pulse"></div>
          <div className="flex-1 bg-slate-100 rounded-t-sm h-[70%] animate-pulse"></div>
          <div className="flex-1 bg-slate-100 rounded-t-sm h-[90%] animate-pulse"></div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <div className="h-3 w-10 rounded bg-slate-50 animate-pulse"></div>
          <div className="h-3 w-10 rounded bg-slate-50 animate-pulse"></div>
        </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
