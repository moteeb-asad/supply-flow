import RecentReceivingActivityCard from "./RecentReceivingActivityCard";

// Same frame and row height as the loaded table so nothing shifts.
export default function RecentReceivingActivitySkeleton() {
  return (
    <RecentReceivingActivityCard>
      <div className="divide-y divide-line-soft">
        <div className="h-9 border-y border-line bg-background-light" />
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-4 px-5 py-3">
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-24 animate-pulse rounded bg-background-light" />
              <div className="h-3 w-20 animate-pulse rounded bg-background-light" />
            </div>
            <div className="h-3.5 w-28 animate-pulse rounded bg-background-light" />
            <div className="h-3.5 w-12 animate-pulse rounded bg-background-light" />
            <div className="h-[22px] w-20 animate-pulse rounded-full bg-background-light" />
          </div>
        ))}
      </div>
    </RecentReceivingActivityCard>
  );
}
