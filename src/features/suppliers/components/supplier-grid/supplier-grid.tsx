import SupplierCard from "../supplier-grid/supplier-card";
import type { Supplier } from "@/src/features/suppliers/types/suppliers.types";

type SupplierGridProps = {
  suppliers: Supplier[];
};

export default function SupplierGrid({ suppliers }: SupplierGridProps) {
  if (suppliers.length === 0) {
    return (
      <div className="border border-dashed border-[#d0d7e7] rounded-xl p-8 text-center text-sm text-[#4e6797]">
        No suppliers found yet.
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
    </>
  );
}
