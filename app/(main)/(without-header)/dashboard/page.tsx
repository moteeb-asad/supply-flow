import { Suspense } from "react";
import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";
import { getRoleFromAppMetadata } from "@/src/features/auth/utils/rbac";
import DashboardKpis from "@/src/features/dashboard/components/DashboardKpis";
import DashboardKpisSkeleton from "@/src/features/dashboard/components/DashboardKpisSkeleton";
import QuickTasks from "@/src/features/dashboard/components/QuickTasks";
import RecentReceivingActivity from "@/src/features/dashboard/components/RecentReceivingActivity";
import RecentReceivingActivitySkeleton from "@/src/features/dashboard/components/RecentReceivingActivitySkeleton";
import SupplierPerformance from "@/src/features/dashboard/components/SupplierPerformance";
import SupplierPerformanceSkeleton from "@/src/features/dashboard/components/SupplierPerformanceSkeleton";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const role = getRoleFromAppMetadata(user?.app_metadata);

  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-6 p-6">
        <div>
          <h3 className="text-2xl font-bold text-ink">
            Welcome back, {displayName}
          </h3>
          <p className="text-muted text-sm mt-1">
            Here&apos;s what&apos;s happening in your warehouse today.
          </p>
        </div>
        <Suspense fallback={<DashboardKpisSkeleton />}>
          <DashboardKpis role={role} />
        </Suspense>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Suspense fallback={<RecentReceivingActivitySkeleton />}>
            <RecentReceivingActivity role={role} />
          </Suspense>
          <Suspense fallback={<SupplierPerformanceSkeleton />}>
            <SupplierPerformance role={role} />
          </Suspense>
        </div>
        <QuickTasks role={role} />
      </div>
    </>
  );
}
