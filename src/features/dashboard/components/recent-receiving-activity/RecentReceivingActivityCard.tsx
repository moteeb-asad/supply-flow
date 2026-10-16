import Link from "next/link";
import type { ReactNode } from "react";

// Card frame shared by the widget, its skeleton, and its empty/error states.
export default function RecentReceivingActivityCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line-soft bg-white">
      <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
        <h4 className="text-sm font-bold">Recent Receiving Activity</h4>
        <Link
          className="text-xs font-bold text-primary hover:underline"
          href="/sku-receiving"
        >
          View All Logs
        </Link>
      </div>
      {children}
    </div>
  );
}
