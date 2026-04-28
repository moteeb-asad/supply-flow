import SupplierPicker from "@/src/features/shared/suppliers/components/SupplierPicker";
import type { SupplierAssignmentSectionProps } from "../../types/form.types";

export default function SupplierAssignmentSection({
  errors,
  setValue,
  clearErrors,
}: SupplierAssignmentSectionProps) {
  return (
    <section className="space-y-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">
          local_shipping
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
          Supplier Assignment
        </h3>
      </div>
      <SupplierPicker
        error={errors.primarySupplier?.message}
        onSupplierChange={(supplier) => {
          setValue("primarySupplier", supplier?.id ?? "");
          if (supplier) clearErrors("primarySupplier");
        }}
      />
    </section>
  );
}
