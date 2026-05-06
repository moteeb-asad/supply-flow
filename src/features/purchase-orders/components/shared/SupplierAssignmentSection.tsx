"use client";

import SupplierPicker from "@/src/features/shared/suppliers/components/SupplierPicker";
import { SupplierAssignmentSectionProps } from "@/src/features/purchase-orders/types/form.types";

export default function SupplierAssignmentSection({
  errors,
  setValue,
  clearErrors,
}: SupplierAssignmentSectionProps) {
  return (
    <section className="space-y-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">
          store
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
          Supplier Assignment
        </h3>
      </div>
      <SupplierPicker
        error={errors.supplierId?.message}
        onSupplierChange={(supplier) => {
          setValue("supplierId", supplier?.id ?? "", {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue("supplierName", supplier?.name ?? "", {
            shouldDirty: true,
            shouldValidate: false,
          });
          if (supplier) clearErrors("supplierId");
        }}
      />
    </section>
  );
}
