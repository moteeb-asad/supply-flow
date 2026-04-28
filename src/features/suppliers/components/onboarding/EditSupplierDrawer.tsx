import { FormDrawer } from "@/src/components/ui/FormDrawer";
import { SupplierForm, SUPPLIER_FORM_ID } from "./SupplierForm";
import type {
  EditSupplierDrawerProps,
  SupplierFormValues,
} from "@/src/features/suppliers/types/suppliers.types";

type EditSupplierDrawerPropsWithSuccess = EditSupplierDrawerProps & {
  onSuccess?: () => void;
};
import { updateSupplierAction } from "@/src/features/suppliers/actions/update-supplier.action";
import { useState, useTransition } from "react";

export function EditSupplierDrawer({
  onClose,
  supplier,
  onSuccess,
}: EditSupplierDrawerPropsWithSuccess) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const category: SupplierFormValues["category"] =
    supplier.category === "liquid" || supplier.category === "mixed"
      ? supplier.category
      : "dry";

  const status: SupplierFormValues["status"] =
    supplier.status === "inactive" ? "inactive" : "active";

  const initialValues = {
    name: supplier.name,
    category,
    status,
    contactName: supplier.primary_contact_name ?? "",
    email: supplier.primary_contact_email ?? "",
    contactPhone: supplier.primary_contact_phone ?? "",
    notes: supplier.notes ?? "",
    paymentTerms: supplier.payment_terms ?? "Net 30",
    minOrderQty: supplier.min_order_qty ?? 100,
    leadTimeDays: supplier.lead_time_days ?? 7,
  };

  const handleSubmit = async (values: SupplierFormValues) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await updateSupplierAction(supplier.id, values);
      if (result.success) {
        onSuccess?.();
        onClose?.();
      } else {
        setServerError(result.error);
      }
    });
  };

  return (
    <FormDrawer
      title="Edit Supplier"
      description="Update supplier details and save changes."
      submitLabel="Save Changes"
      submittingLabel="Saving..."
      formId={SUPPLIER_FORM_ID}
      isSubmitting={isPending}
      onClose={onClose}
    >
      <SupplierForm
        formId={SUPPLIER_FORM_ID}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        serverError={serverError}
      />
    </FormDrawer>
  );
}
