import { DataTableSkeletonProps } from "../../data-table/types";

const bar = "animate-pulse rounded bg-background-light";

// Placeholder rows with a small status chip, shown inside the table card.
export default function DataTableSkeleton({
  type = "loading",
}: DataTableSkeletonProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-6 z-10 flex justify-center">
        <div className="flex items-center gap-2.5 rounded-control border border-line bg-surface px-4 py-2.5 shadow-raised">
          <div className="size-4 animate-spin rounded-full border-2 border-line border-t-ink" />
          <span className="text-[13px] font-medium text-ink">
            {type === "search" ? "Searching..." : "Loading..."}
          </span>
        </div>
      </div>
      <div className="divide-y divide-line-soft border-t border-line">
        <div className="h-9 bg-background-light" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-3.5">
            <div className={`h-3.5 w-32 ${bar}`} />
            <div className={`h-3.5 w-40 ${bar}`} />
            <div className={`h-[22px] w-20 rounded-full ${bar}`} />
            <div className={`ml-auto h-3.5 w-16 ${bar}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
