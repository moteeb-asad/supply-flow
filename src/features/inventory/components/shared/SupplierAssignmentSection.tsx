import SupplierPicker from "@/src/features/shared/suppliers/components/SupplierPicker";
import type { SupplierAssignmentSectionProps } from "../../types/form.types";
import { sectionHeadingClassName } from "./fields";

export default function SupplierAssignmentSection({
  errors,
  setValue,
  clearErrors,
}: SupplierAssignmentSectionProps) {
  return (
    <section
      aria-labelledby="inventory-supplier"
      className="space-y-3 border-t border-line-soft pt-6"
    >
      <h3 id="inventory-supplier" className={sectionHeadingClassName}>
        Primary supplier
      </h3>
      <SupplierPicker
        label=""
        error={errors.primarySupplier?.message}
        onSupplierChange={(supplier) => {
          setValue("primarySupplier", supplier?.id ?? "");
          if (supplier) clearErrors("primarySupplier");
        }}
      />
      <p className="text-xs text-muted">
        Used as the default supplier when this item goes low.
      </p>
    </section>
  );
}
