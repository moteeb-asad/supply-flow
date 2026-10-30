import Link from "next/link";
import type { ReactNode } from "react";

// Card frame shared by the widget, its skeleton, and its empty/error states.
export default function RecentReceivingActivityCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby="recent-receiving-title"
      className="h-full min-w-0 overflow-hidden rounded-card border border-line"
    >
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h2 id="recent-receiving-title" className="text-[15px] font-semibold">
          Recent receiving
        </h2>
        <Link
          className="text-[13px] font-medium text-primary hover:underline"
          href="/sku-receiving"
        >
          View all
        </Link>
      </div>
      {children}
    </section>
  );
}
