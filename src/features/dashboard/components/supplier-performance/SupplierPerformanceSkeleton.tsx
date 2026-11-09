import SupplierPerformanceCard from "./SupplierPerformanceCard";

export default function SupplierPerformanceSkeleton() {
  return (
    <SupplierPerformanceCard>
      <div className="px-5 pb-5 pt-4">
        <div className="h-[260px] w-full animate-pulse rounded-control bg-background-light" />
      </div>
    </SupplierPerformanceCard>
  );
}
