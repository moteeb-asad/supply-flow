import SupplierPerformanceCard from "./SupplierPerformanceCard";

export default function SupplierPerformanceSkeleton() {
  return (
    <SupplierPerformanceCard>
      <div className="h-48 w-full animate-pulse rounded-lg bg-gray-50" />
    </SupplierPerformanceCard>
  );
}
