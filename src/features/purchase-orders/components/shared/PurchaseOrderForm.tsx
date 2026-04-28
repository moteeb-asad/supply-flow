"use client";

import { useState } from "react";
import type {
  PurchaseOrderFormProps,
  PurchaseOrderFormValues,
} from "../../types";
import { createPurchaseOrderSchema } from "../../validators/purchase-order.schema";
import AdditionalNotesSection from "./AdditionalNotesSection";
import LineItemsSection from "./LineItemsSection";
import OrderDetailsSection from "./OrderDetailsSection";
import SupplierSelectionSection from "./SupplierSelectionSection";
import TotalAmountSection from "./TotalAmountSection";

const defaultValues: PurchaseOrderFormValues = {
  supplierId: "",
  supplierName: "",
  orderDate: "",
  expectedDeliveryDate: "",
  shippingMethod: "standard",
  paymentMethod: "cod",
  status: "draft",
  notes: "",
  lineItems: [],
};

export default function PurchaseOrderForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  onAddItemClick,
  onLineItemsChange,
  isSubmitting = false,
}: PurchaseOrderFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{
    supplier?: string;
    orderDate?: string;
    expectedDeliveryDate?: string;
    shippingMethod?: string;
    paymentMethod?: string;
    status?: string;
    lineItems?: string;
    notes?: string;
  }>({});

  const merged: PurchaseOrderFormValues = {
    ...defaultValues,
    ...initialValues,
    lineItems: initialValues?.lineItems ?? defaultValues.lineItems,
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PurchaseOrderFormValues["paymentMethod"]
  >(merged.paymentMethod);

  const lineItems = merged.lineItems;

  const handleLineItemsChange = (
    nextItems: PurchaseOrderFormValues["lineItems"],
  ) => {
    onLineItemsChange?.(nextItems);
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxRate = selectedPaymentMethod === "card" ? 0.05 : 0.16;
  const taxLabel = selectedPaymentMethod === "card" ? "GST (5%)" : "GST (16%)";
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const supplierId = String(formData.get("supplierId") ?? "").trim();
    const supplierName = String(formData.get("supplierName") ?? "").trim();
    const orderDate = String(formData.get("orderDate") ?? "").trim();
    const expectedDeliveryDate = String(
      formData.get("expectedDeliveryDate") ?? "",
    ).trim();
    const shippingMethod =
      String(formData.get("shippingMethod") ?? "standard") || "standard";
    const paymentMethod =
      String(formData.get("paymentMethod") ?? "cod") || "cod";
    const status = String(formData.get("status") ?? "draft") || "draft";
    const notes = String(formData.get("notes") ?? "").trim();

    const normalizedLineItems = lineItems.map((item) => ({
      skuName: String(item.skuName ?? "").trim(),
      quantity: Number.isFinite(item.quantity) ? item.quantity : 0,
      unitPrice: Number.isFinite(item.unitPrice) ? item.unitPrice : 0,
    }));

    const payload: PurchaseOrderFormValues = {
      supplierId: supplierId || merged.supplierId,
      supplierName: supplierName || merged.supplierName,
      orderDate: orderDate || merged.orderDate,
      expectedDeliveryDate,
      shippingMethod:
        shippingMethod as PurchaseOrderFormValues["shippingMethod"],
      paymentMethod: paymentMethod as PurchaseOrderFormValues["paymentMethod"],
      status: status as PurchaseOrderFormValues["status"],
      notes,
      lineItems: normalizedLineItems,
    };

    const validationResult = createPurchaseOrderSchema.safeParse(payload);

    if (!validationResult.success) {
      const flattenedFieldErrors = validationResult.error.flatten().fieldErrors;

      setFieldErrors({
        supplier:
          flattenedFieldErrors.supplierId?.[0] ??
          flattenedFieldErrors.supplierName?.[0],
        orderDate: flattenedFieldErrors.orderDate?.[0],
        expectedDeliveryDate: flattenedFieldErrors.expectedDeliveryDate?.[0],
        shippingMethod: flattenedFieldErrors.shippingMethod?.[0],
        paymentMethod: flattenedFieldErrors.paymentMethod?.[0],
        status: flattenedFieldErrors.status?.[0],
        lineItems: flattenedFieldErrors.lineItems?.[0],
        notes: flattenedFieldErrors.notes?.[0],
      });

      const summaryErrors = Object.values(flattenedFieldErrors)
        .flat()
        .filter((message): message is string => Boolean(message));

      const dedupedSummaryErrors = [...new Set(summaryErrors)];

      setValidationErrors(
        dedupedSummaryErrors.length > 0
          ? dedupedSummaryErrors
          : ["Please fix the highlighted form issues."],
      );

      return;
    }

    setFieldErrors({});
    setValidationErrors([]);
    onSubmit?.(payload);
  };

  return (
    <form
      className="flex-1 min-h-0 flex flex-col overflow-hidden"
      onSubmit={handleSubmit}
    >
      <div
        className={`flex-1 min-h-0 overflow-y-auto p-6 space-y-8 transition-opacity ${
          isSubmitting ? "opacity-60" : "opacity-100"
        }`}
      >
        {validationErrors.length > 0 ? (
          <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
            {validationErrors.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        ) : null}

        <SupplierSelectionSection
          supplierId={merged.supplierId}
          supplierName={merged.supplierName}
          error={fieldErrors.supplier}
        />
        <OrderDetailsSection
          expectedDeliveryDate={merged.expectedDeliveryDate}
          orderDate={merged.orderDate}
          shippingMethod={merged.shippingMethod}
          paymentMethod={selectedPaymentMethod}
          onPaymentMethodChange={setSelectedPaymentMethod}
          status={merged.status}
          errors={{
            orderDate: fieldErrors.orderDate,
            expectedDeliveryDate: fieldErrors.expectedDeliveryDate,
            shippingMethod: fieldErrors.shippingMethod,
            paymentMethod: fieldErrors.paymentMethod,
            status: fieldErrors.status,
          }}
          mode={mode}
        />
        <LineItemsSection
          initialItems={lineItems}
          onLineItemsChange={handleLineItemsChange}
          onAddItemClick={isSubmitting ? undefined : onAddItemClick}
          error={fieldErrors.lineItems}
        />
        <AdditionalNotesSection
          notes={merged.notes}
          error={fieldErrors.notes}
        />
      </div>
      <TotalAmountSection
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        subtotal={subtotal}
        submitLabel={
          mode === "create" ? "Create Purchase Order" : "Save Changes"
        }
        taxLabel={taxLabel}
        taxAmount={taxAmount}
        totalAmount={totalAmount}
      />
    </form>
  );
}
