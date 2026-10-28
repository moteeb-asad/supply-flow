"use client";

import { FormDrawer } from "@/src/components/ui/FormDrawer";
import { SupplierForm, SUPPLIER_FORM_ID } from "./SupplierForm";
import type {
  CreateSupplierDrawerProps,
  SupplierFormValues,
} from "@/src/features/suppliers/types/suppliers.types";
import { createSupplierAction } from "@/src/features/suppliers/actions/create-supplier.action";
import { useActionState, useEffect, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supplierKeys } from "@/src/features/suppliers/constants/query-keys";

export function CreateSupplierDrawer({
  onClose,
  onSuccess,
}: CreateSupplierDrawerProps) {
  const queryClient = useQueryClient();
  const [state, formAction] = useActionState(createSupplierAction, undefined);
  const [isPending, startTransition] = useTransition();
  const formKey = state?.resetKey ?? "initial";

  useEffect(() => {
    if (state?.success) {
      void queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      onSuccess?.();
      onClose?.();
    }
  }, [state?.success, state?.resetKey, queryClient, onClose, onSuccess]);

  const handleSubmit = (values: SupplierFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("status", values.status);
    formData.append("contactName", values.contactName ?? "");
    formData.append("email", values.email ?? "");
    formData.append("contactPhone", values.contactPhone ?? "");
    formData.append("notes", values.notes ?? "");
    formData.append("paymentTerms", values.paymentTerms);
    formData.append("minOrderQty", String(values.minOrderQty));
    formData.append("leadTimeDays", String(values.leadTimeDays));

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <FormDrawer
      title="Add New Supplier"
      description="Fill in the details to onboard a new vendor."
      submitLabel="Save & Onboard Supplier"
      submittingLabel="Onboarding..."
      formId={SUPPLIER_FORM_ID}
      isSubmitting={isPending}
      onClose={onClose}
    >
      <SupplierForm
        key={formKey}
        formId={SUPPLIER_FORM_ID}
        onSubmit={handleSubmit}
        serverError={state?.error}
      />
    </FormDrawer>
  );
}
