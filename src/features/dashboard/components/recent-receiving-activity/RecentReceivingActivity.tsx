import Link from "next/link";
import type { Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import {
  SKU_RECEIVING_STATUSES,
  SKU_RECEIVING_STATUS_STYLES,
} from "@/src/features/sku-receiving/constants/statuses";
import type { SKUReceivingStatus } from "@/src/features/sku-receiving/types";
import { getRecentReceivingActivity } from "../../server/get-recent-receiving-activity";
import { formatCount, formatRelativeTime } from "../../utils/format";
import RecentReceivingActivityCard from "./RecentReceivingActivityCard";

type RecentReceivingActivityProps = {
  role: Role | null;
};

const getStatusStyle = (status: string) =>
  SKU_RECEIVING_STATUSES.includes(status as SKUReceivingStatus)
    ? SKU_RECEIVING_STATUS_STYLES[status as SKUReceivingStatus]
    : SKU_RECEIVING_STATUS_STYLES.pending;

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
        <p className="px-4 py-8 text-center text-sm text-muted">
          Couldn&apos;t load recent activity. Please refresh the page.
        </p>
      </RecentReceivingActivityCard>
    );
  }

  if (items.length === 0) {
    return (
      <RecentReceivingActivityCard>
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <p className="text-sm text-muted">No receipts yet.</p>
          {hasPermission(role, "receiving:create") ? (
            <Link
              className="text-sm font-bold text-primary hover:underline"
              href="/sku-receiving"
            >
              Start Receiving
            </Link>
          ) : null}
        </div>
      </RecentReceivingActivityCard>
    );
  }

  return (
    <RecentReceivingActivityCard>
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[520px] text-left">
          <thead className="border-b border-line-soft bg-slate-50">
            <tr>
              {["SKU / Item", "Vendor", "Qty", "Status", "Received"].map(
                (header) => (
                  <th
                    key={header}
                    className="whitespace-nowrap px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {items.map((item) => {
              const style = getStatusStyle(item.receipt_status);
              const rejected = Number(item.qty_rejected);

              return (
                <tr key={item.line_item_id}>
                  <td className="whitespace-nowrap px-4 py-2">
                    <p className="text-[13px] font-semibold text-ink">
                      {item.sku_code}
                    </p>
                    <p className="text-[11px] text-muted">{item.sku_name}</p>
                  </td>
                  <td className="max-w-[160px] px-4 py-2">
                    <p
                      className="truncate text-[13px] text-ink"
                      title={item.supplier_name ?? undefined}
                    >
                      {item.supplier_name ?? "Unknown Supplier"}
                    </p>
                    <p className="truncate text-[11px] text-muted">
                      #{item.po_number}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-[13px] text-ink">
                    {formatCount(Number(item.qty_received))}
                    {item.unit ? ` ${item.unit}` : ""}
                    {rejected > 0 ? (
                      <span className="ml-1.5 text-[11px] font-medium text-danger">
                        · {formatCount(rejected)} rejected
                      </span>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${style.className}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${style.dotClass}`}
                      />
                      {style.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-[11px] text-muted">
                    {formatRelativeTime(item.receipt_datetime)}
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
