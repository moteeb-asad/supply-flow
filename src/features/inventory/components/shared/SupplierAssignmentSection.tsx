import SupplierPicker from "@/src/features/shared/suppliers/components/SupplierPicker";
import type { SupplierAssignmentSectionProps } from "../../types/form.types";

export default function SupplierAssignmentSection({
  values,
  onChange,
  error,
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
        initialSupplierName={values.primarySupplier}
        label="Primary Supplier"
        placeholder="Search for a supplier"
        onSupplierChange={(supplier) =>
          onChange("primarySupplier", supplier?.name ?? "")
        }
        error={error}
      />
    </section>
  );
}
