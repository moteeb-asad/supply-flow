import Link from "next/link";
import { StatusPill } from "@/src/components/ui/StatusPill";
import type { Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import { getRecentReceivingActivity } from "../../server/get-recent-receiving-activity";
import { formatRelative } from "@/src/lib/dates";
import { formatCount } from "../../utils/format";
import RecentReceivingActivityCard from "./RecentReceivingActivityCard";

type RecentReceivingActivityProps = {
  role: Role | null;
};

const HEADERS: { label: string; className: string }[] = [
  { label: "Item", className: "px-5" },
  { label: "Supplier", className: "px-3" },
  { label: "Qty", className: "px-3 text-right" },
  { label: "Status", className: "px-3" },
  { label: "Received", className: "px-5 text-right" },
];

// Async Server Component in its own Suspense boundary: loads independently of
// the KPI cards and the chart.
export default async function RecentReceivingActivity({
  role,
}: RecentReceivingActivityProps) {
  if (!hasPermission(role, "receiving:view")) return null;

  const items = await getRecentReceivingActivity();

  if (!items) {
    return (
      <RecentReceivingActivityCard>
        <p className="border-t border-line px-5 py-10 text-center text-[13px] text-muted">
          Couldn&apos;t load recent activity. Please refresh the page.
        </p>
      </RecentReceivingActivityCard>
    );
  }

  if (items.length === 0) {
    return (
      <RecentReceivingActivityCard>
        <div className="flex flex-col items-center gap-2 border-t border-line px-5 py-10 text-center">
          <p className="text-[13px] text-muted">No receipts yet.</p>
          {hasPermission(role, "receiving:create") ? (
            <Link
              className="text-[13px] font-medium text-primary hover:underline"
              href="/sku-receiving?create=1"
            >
              Start receiving
            </Link>
          ) : null}
        </div>
      </RecentReceivingActivityCard>
    );
  }

  return (
    <RecentReceivingActivityCard>
      <div className="scrollbar-thin relative overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
          <thead className="bg-background-light text-xs text-subtle">
            <tr className="border-y border-line">
              {HEADERS.map(({ label, className }) => (
                <th
                  key={label}
                  scope="col"
                  className={`${className} py-2.5 font-medium`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {items.map((item) => {
              const rejected = Number(item.qty_rejected);
              const quantity = `${formatCount(Number(item.qty_received))}${
                item.unit ? ` ${item.unit}` : ""
              }`;

              return (
                <tr
                  key={item.line_item_id}
                  className="hover:bg-background-light/60"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium">{item.sku_name}</p>
                    <p className="font-mono text-xs text-subtle">
                      {item.sku_code}
                    </p>
                  </td>
                  <td className="max-w-[180px] px-3 py-3">
                    <p
                      className="truncate text-ink"
                      title={item.supplier_name ?? undefined}
                    >
                      {item.supplier_name ?? "Unknown supplier"}
                    </p>
                    <p className="font-mono text-xs text-subtle">
                      {item.po_number}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    <p className="tabular-nums">{quantity}</p>
                    {rejected > 0 ? (
                      <p className="text-xs text-danger">
                        {formatCount(rejected)} rejected
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={item.receipt_status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right text-muted">
                    {formatRelative(item.receipt_datetime)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </RecentReceivingActivityCard>
  );
}
