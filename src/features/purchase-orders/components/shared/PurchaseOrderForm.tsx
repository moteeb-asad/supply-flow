"use client";

import { useState } from "react";
import type {
  PurchaseOrderFormProps,
  PurchaseOrderFormValues,
} from "../../types/purchase-orders.types";
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
  isSubmitting = false,
}: PurchaseOrderFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{
    supplier?: string;
    orderDate?: string;
    expectedDeliveryDate?: string;
    shippingMethod?: string;
    status?: string;
    lineItems?: string;
    notes?: string;
  }>({});

  const merged: PurchaseOrderFormValues = {
    ...defaultValues,
    ...initialValues,
    lineItems: initialValues?.lineItems ?? defaultValues.lineItems,
  };

  const subtotal = merged.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxAmount = Number((subtotal * 0.08).toFixed(2));
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
    const status = String(formData.get("status") ?? "draft") || "draft";
    const notes = String(formData.get("notes") ?? "").trim();

    const lineItemsMap = new Map<
      number,
      { skuName?: string; quantity?: number; unitPrice?: number }
    >();

    for (const [key, value] of formData.entries()) {
      const match = key.match(
        /lineItems\[(\d+)\]\.(skuName|quantity|unitPrice)/,
      );
      if (!match) continue;

      const index = Number(match[1]);
      const field = match[2];
      const row = lineItemsMap.get(index) ?? {};

      if (field === "skuName") {
        row.skuName = String(value ?? "").trim();
      }

      if (field === "quantity") {
        row.quantity = Number(value);
      }

      if (field === "unitPrice") {
        row.unitPrice = Number(value);
      }

      lineItemsMap.set(index, row);
    }

    const lineItems = Array.from(lineItemsMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, item]) => {
        const quantity =
          typeof item.quantity === "number" && Number.isFinite(item.quantity)
            ? item.quantity
            : 0;
        const unitPrice =
          typeof item.unitPrice === "number" && Number.isFinite(item.unitPrice)
            ? item.unitPrice
            : 0;

        return {
          skuName: item.skuName ?? "",
          quantity,
          unitPrice,
        };
      });

    const payload: PurchaseOrderFormValues = {
      supplierId: supplierId || merged.supplierId,
      supplierName: supplierName || merged.supplierName,
      orderDate: orderDate || merged.orderDate,
      expectedDeliveryDate,
      shippingMethod:
        shippingMethod as PurchaseOrderFormValues["shippingMethod"],
      status: status as PurchaseOrderFormValues["status"],
      notes,
      lineItems: lineItems.length > 0 ? lineItems : merged.lineItems,
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
        className={`flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-8 transition-opacity ${
          isSubmitting ? "opacity-60" : "opacity-100"
        }`}
      >
        {validationErrors.length > 0 ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
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
          status={merged.status}
          errors={{
            orderDate: fieldErrors.orderDate,
            expectedDeliveryDate: fieldErrors.expectedDeliveryDate,
            shippingMethod: fieldErrors.shippingMethod,
            status: fieldErrors.status,
          }}
          mode={mode}
        />
        <LineItemsSection
          initialItems={merged.lineItems}
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
        taxAmount={taxAmount}
        totalAmount={totalAmount}
      />
    </form>
  );
}
