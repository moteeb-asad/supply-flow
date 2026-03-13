"use client";

import type {
  PurchaseOrderFormProps,
  PurchaseOrderFormValues,
} from "../../types/purchase-orders.types";
import LineItemsSection from "./LineItemsSection";
import OrderDetailsSection from "./OrderDetailsSection";
import SupplierSelectionSection from "./SupplierSelectionSection";
import TotalAmountSection from "./TotalAmountSection";

const defaultValues: PurchaseOrderFormValues = {
  supplierId: "",
  supplierName: "",
  orderDate: "2023-10-25",
  expectedDeliveryDate: "",
  shippingMethod: "standard",
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

    onSubmit?.({
      supplierId: supplierId || merged.supplierId,
      supplierName: supplierName || merged.supplierName,
      orderDate: orderDate || merged.orderDate,
      expectedDeliveryDate,
      shippingMethod:
        shippingMethod as PurchaseOrderFormValues["shippingMethod"],
      lineItems: lineItems.length > 0 ? lineItems : merged.lineItems,
    });
  };

  return (
    <form
      className="flex-1 min-h-0 flex flex-col overflow-hidden"
      onSubmit={handleSubmit}
    >
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-8">
        <SupplierSelectionSection
          supplierId={merged.supplierId}
          supplierName={merged.supplierName}
        />
        <OrderDetailsSection
          expectedDeliveryDate={merged.expectedDeliveryDate}
          orderDate={merged.orderDate}
          shippingMethod={merged.shippingMethod}
        />
        <LineItemsSection
          initialItems={merged.lineItems}
          onAddItemClick={onAddItemClick}
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
