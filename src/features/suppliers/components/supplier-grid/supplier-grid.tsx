import SupplierCard from "../supplier-grid/supplier-card";
import type { SupplierGridProps } from "@/src/features/suppliers/types/suppliers.types";

export default function SupplierGrid({
  suppliers,
  hasMore,
  isLoading,
  onLoadMore,
}: SupplierGridProps) {
  if (isLoading && suppliers.length === 0) {
    return (
      <div className="border border-dashed border-[#d0d7e7] rounded-xl p-8 text-center text-sm text-[#4e6797]">
        Loading suppliers...
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="border border-dashed border-[#d0d7e7] rounded-xl p-8 text-center text-sm text-[#4e6797]">
        No suppliers found.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
      {hasMore && (
        <div className="pt-8 flex justify-center">
          <button
            className="px-8 py-3 bg-white dark:bg-slate-800 border border-[#d0d7e7] rounded-xl text-sm font-bold text-[#4e6797] hover:bg-slate-50 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More Suppliers"}
          </button>
        </div>
      )}
    </>
  );
}
