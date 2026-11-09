import { Suspense } from "react";
import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";
import {
  getRoleFromAppMetadata,
  hasPermission,
} from "@/src/features/auth/utils/rbac";
import DashboardHeader from "@/src/features/dashboard/components/header/DashboardHeader";
import DashboardKpis from "@/src/features/dashboard/components/kpis/DashboardKpis";
import DashboardKpisSkeleton from "@/src/features/dashboard/components/kpis/DashboardKpisSkeleton";
import QuickTasks from "@/src/features/dashboard/components/quick-tasks/QuickTasks";
import RecentReceivingActivity from "@/src/features/dashboard/components/recent-receiving-activity/RecentReceivingActivity";
import RecentReceivingActivitySkeleton from "@/src/features/dashboard/components/recent-receiving-activity/RecentReceivingActivitySkeleton";
import SupplierPerformance from "@/src/features/dashboard/components/supplier-performance/SupplierPerformance";
import SupplierPerformanceSkeleton from "@/src/features/dashboard/components/supplier-performance/SupplierPerformanceSkeleton";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const firstName = String(displayName).split(" ")[0];
  const role = getRoleFromAppMetadata(user?.app_metadata);

  // Receiving table 7/12 and chart 5/12; one of them takes the full row when
  // the role can't see the other.
  const showReceiving = hasPermission(role, "receiving:view");
  const showChart = hasPermission(role, "suppliers:view");
  const bothWidgets = showReceiving && showChart;

  return (
    <>
      <DashboardHeader firstName={firstName} role={role} />

      <div className="space-y-6 px-8 pb-8">
        <Suspense fallback={<DashboardKpisSkeleton />}>
          <DashboardKpis role={role} />
        </Suspense>

        {showReceiving || showChart ? (
          <div className="grid gap-6 lg:grid-cols-12">
            {showReceiving ? (
              <div
                className={`min-w-0 ${bothWidgets ? "lg:col-span-7" : "lg:col-span-12"}`}
              >
                <Suspense fallback={<RecentReceivingActivitySkeleton />}>
                  <RecentReceivingActivity role={role} />
                </Suspense>
              </div>
            ) : null}
            {showChart ? (
              <div
                className={`min-w-0 ${bothWidgets ? "lg:col-span-5" : "lg:col-span-12"}`}
              >
                <Suspense fallback={<SupplierPerformanceSkeleton />}>
                  <SupplierPerformance role={role} />
                </Suspense>
              </div>
            ) : null}
          </div>
        ) : null}

        <QuickTasks role={role} />
      </div>
    </>
  );
}
