"use client";

import SupplierPicker from "@/src/features/shared/suppliers/components/SupplierPicker";
import type { SupplierSelectionSectionProps } from "../../types";

export default function SupplierSelectionSection({
  supplierId,
  supplierName,
  error,
}: SupplierSelectionSectionProps) {
  return (
    <section className="space-y-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">
          store
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
          Supplier Selection
        </h3>
      </div>
      <SupplierPicker
        error={error}
        initialSupplierId={supplierId}
        initialSupplierName={supplierName}
      />
    </section>
  );
}
