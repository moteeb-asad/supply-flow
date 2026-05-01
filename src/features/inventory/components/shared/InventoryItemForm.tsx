"use client";

import GeneralInformationSection from "./GeneralInformationSection";
import StockDetailsSection from "./StockDetailsSection";
import SupplierAssignmentSection from "./SupplierAssignmentSection";
import { AddInventoryItemSchema } from "../../validators/inventory-item.schema";
import type {
  InventoryItemFormProps,
  InventoryItemFormValues,
} from "../../types/form.types";
import FormErrorBanner, {
  getValidationSummaryMessage,
} from "@/src/components/ui/FormErrorBanner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const INVENTORY_FORM_ID = "inventory-form";

const getInventoryItemDefaultValues = (
  initialValues?: Partial<InventoryItemFormValues>,
): InventoryItemFormValues => ({
  itemName: initialValues?.itemName ?? "",
  skuCode: initialValues?.skuCode ?? "",
  unit: (initialValues?.unit ?? "") as InventoryItemFormValues["unit"],
  category: initialValues?.category ?? "",
  initialStock: initialValues?.initialStock ?? 0,
  unitPrice: initialValues?.unitPrice ?? 0,
  primarySupplier: initialValues?.primarySupplier ?? "",
});

export default function InventoryItemForm({
  formId = INVENTORY_FORM_ID,
  initialValues,
  onSubmit,
  serverError,
  isSubmitting,
}: InventoryItemFormProps) {
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(AddInventoryItemSchema),
    defaultValues: getInventoryItemDefaultValues(initialValues),
  });
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
      <div
        className={`flex-1 min-h-0 space-y-8 transition-opacity ${
          isSubmitting ? "opacity-60" : "opacity-100"
        }`}
      >
        <FormErrorBanner align="center" message={bannerMessage} />
        <SupplierAssignmentSection
          register={register}
          errors={errors}
          setValue={setValue}
          clearErrors={clearErrors}
        />
        <GeneralInformationSection
          register={register}
          errors={errors}
          setValue={setValue}
          clearErrors={clearErrors}
        />
        <StockDetailsSection
          register={register}
          errors={errors}
          control={control}
        />
      </div>
    </form>
  );
}
