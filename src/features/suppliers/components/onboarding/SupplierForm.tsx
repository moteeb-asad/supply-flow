"use client";

import type {
  SupplierFormProps,
  SupplierFormValues,
} from "@/src/features/suppliers/types/suppliers.types";
import { supplierFormSchema } from "@/src/features/suppliers/validators/suppliers.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { SupplierContactSection } from "./form-sections/SupplierContactSection";
import { SupplierIdentitySection } from "./form-sections/SupplierIdentitySection";
import { SupplierTermsSection } from "./form-sections/SupplierTermsSection";
import FormErrorBanner, {
  getValidationSummaryMessage,
} from "@/src/components/ui/FormErrorBanner";

export const SUPPLIER_FORM_ID = "supplier-form";

const getSupplierDefaultValues = (
  initialValues?: Partial<SupplierFormValues>,
): SupplierFormValues => ({
  name: initialValues?.name ?? "",
  category: initialValues?.category ?? "dry",
  status: initialValues?.status ?? "active",
  contactName: initialValues?.contactName ?? "",
  email: initialValues?.email ?? "",
  contactPhone: initialValues?.contactPhone ?? "",
  notes: initialValues?.notes ?? "",
  paymentTerms: initialValues?.paymentTerms ?? "Net 30",
  minOrderQty: initialValues?.minOrderQty ?? 100,
  leadTimeDays: initialValues?.leadTimeDays ?? 7,
});

export function SupplierForm({
  formId = SUPPLIER_FORM_ID,
  initialValues,
  onSubmit,
  serverError,
}: SupplierFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: getSupplierDefaultValues(initialValues),
  });

  const leadTimeDays =
    useWatch({
      control,
      name: "leadTimeDays",
    }) ?? 7;

  const fieldErrorCount = Object.values(errors).reduce(
    (count, error) => count + (error?.message ? 1 : 0),
    0,
  );
  const bannerMessage =
    serverError || getValidationSummaryMessage(fieldErrorCount);

  return (
    <form
      className="flex-1 overflow-y-auto p-6 space-y-8"
      id={formId}
      noValidate
      onSubmit={handleSubmit((values) => onSubmit?.(values))}
    >
      <FormErrorBanner message={bannerMessage} />
      <SupplierIdentitySection register={register} errors={errors} />
      <SupplierContactSection register={register} errors={errors} />
      <SupplierTermsSection
        register={register}
        errors={errors}
        leadTimeDays={leadTimeDays}
      />
    </form>
  );
}
