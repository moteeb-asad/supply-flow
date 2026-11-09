"use client";

import SupplierPicker from "@/src/features/shared/suppliers/components/SupplierPicker";
import { SupplierAssignmentSectionProps } from "@/src/features/purchase-orders/types/form.types";
import { sectionHeadingClassName } from "./fields";

export default function SupplierAssignmentSection({
  errors,
  setValue,
  clearErrors,
}: SupplierAssignmentSectionProps) {
  return (
    <section aria-labelledby="po-supplier" className="space-y-3">
      <h3 id="po-supplier" className={sectionHeadingClassName}>
        Supplier
      </h3>
      <SupplierPicker
        label=""
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
