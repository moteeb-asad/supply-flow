"use client";

import { useEffect, useState } from "react";
import type {
  PurchaseOrderFormProps,
  PurchaseOrderFormValues,
} from "@/src/features/purchase-orders/types/form.types";
import { createPurchaseOrderSchema } from "@/src/features/purchase-orders/validators/purchase-order.schema";
import SupplierAssignmentSection from "@/src/features/purchase-orders/components/shared/SupplierAssignmentSection";
import LineItemsSection from "./LineItemsSection";
import AdditionalNotesSection from "./AdditionalNotesSection";
import OrderDetailsSection from "./OrderDetailsSection";
import FormErrorBanner, {
  getValidationSummaryMessage,
} from "@/src/components/ui/FormErrorBanner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TotalAmountSection from "./TotalAmountSection";
import { calculatePurchaseOrderTotals } from "../../utils/calculations";

export const PURCHASE_ORDER_FORM_ID = "inventory-form";

const getPurchaseOrderDefaultValues = (
  initialValues?: Partial<PurchaseOrderFormValues>,
): PurchaseOrderFormValues => ({
  supplierId: initialValues?.supplierId ?? "",
  supplierName: initialValues?.supplierName ?? "",
  orderDate: initialValues?.orderDate ?? "",
  expectedDeliveryDate: initialValues?.expectedDeliveryDate ?? "",
  shippingMethod: initialValues?.shippingMethod ?? "standard",
  paymentMethod: initialValues?.paymentMethod ?? "cod",
  status: initialValues?.status ?? "draft",
  notes: initialValues?.notes ?? "",
  lineItems: initialValues?.lineItems ?? [],
});

export default function PurchaseOrderForm({
  mode,
  formId = PURCHASE_ORDER_FORM_ID,
  initialValues,
  onSubmit,
  onAddItemClick,
  onLineItemsChange,
  onFieldArrayReady,
  serverError,
  isSubmitting,
}: PurchaseOrderFormProps) {
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(createPurchaseOrderSchema),
    defaultValues: getPurchaseOrderDefaultValues(initialValues),
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "lineItems",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "cod" | "card"
  >(initialValues?.paymentMethod ?? "cod");

  useEffect(() => {
    onFieldArrayReady?.({ append });
  }, [onFieldArrayReady, append]);

  const fieldErrorCount = Object.values(errors).reduce(
    (count, error) => count + (error?.message ? 1 : 0),
    0,
  );
  const bannerMessage =
    serverError || getValidationSummaryMessage(fieldErrorCount);

  const handleLineItemsChange = () => {
    onLineItemsChange?.();
  };

  const { subtotal, taxLabel, taxAmount, totalAmount } =
    calculatePurchaseOrderTotals(fields, selectedPaymentMethod);

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
        <OrderDetailsSection
          register={register}
          errors={errors}
          mode={mode}
          onPaymentMethodChange={setSelectedPaymentMethod}
        />
        <LineItemsSection
          register={register}
          errors={errors}
          fields={fields}
          append={append}
          remove={remove}
          update={update}
          onLineItemsChange={handleLineItemsChange}
          onAddItemClick={isSubmitting ? undefined : onAddItemClick}
        />
        <AdditionalNotesSection register={register} errors={errors} />
        <TotalAmountSection
          subtotal={subtotal}
          taxAmount={taxAmount}
          taxLabel={taxLabel}
          totalAmount={totalAmount}
          submitLabel="Create Purchase Order"
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}
