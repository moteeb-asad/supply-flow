import { Suspense } from "react";
import Link from "next/link";
import type { Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import { formatLongDate } from "@/src/lib/dates";
import { getRequestTimezone } from "../../server/request-timezone";
import DashboardSummary from "./DashboardSummary";

type DashboardHeaderProps = {
  firstName: string;
  role: Role | null;
};

const actionClassName =
  "inline-flex h-9 items-center gap-2 rounded-control px-3.5 text-[13px] font-medium";

export default async function DashboardHeader({
  firstName,
  role,
}: DashboardHeaderProps) {
  const timezone = await getRequestTimezone();
  const canCreateOrder = hasPermission(role, "purchase_orders:manage");
  const canReceive = hasPermission(role, "receiving:create");

  return (
    <header className="flex flex-wrap items-end justify-between gap-4 px-8 pb-6 pt-8">
      <div className="min-w-0">
        <p className="text-[13px] text-subtle">
          {formatLongDate(new Date(), timezone)}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.01em]">
          Welcome back, {firstName}
        </h1>
        <Suspense
          fallback={
            <p className="mt-1 text-sm text-muted">
              Here&apos;s what&apos;s happening in your warehouse today.
            </p>
          }
        >
          <DashboardSummary role={role} />
        </Suspense>
      </div>

      {canCreateOrder || canReceive ? (
        <div className="flex flex-wrap gap-2">
          {canCreateOrder ? (
            <Link
              className={`${actionClassName} border border-line bg-surface text-ink hover:bg-background-light`}
              href="/purchase-orders?create=1"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined !text-[18px]"
              >
                add
              </span>
              New order
            </Link>
          ) : null}
          {canReceive ? (
            <Link
              className={`${actionClassName} bg-ink text-white hover:bg-ink/90`}
              href="/sku-receiving?create=1"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined !text-[18px]"
              >
                barcode_scanner
              </span>
              Start receiving
            </Link>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
