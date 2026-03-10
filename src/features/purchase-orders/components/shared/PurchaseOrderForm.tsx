"use client";

import type {
  PurchaseOrderFormValues,
  PurchaseOrderSidebarMode,
} from "../../types/purchase-orders.types";
import LineItemsSection from "./LineItemsSection";
import OrderDetailsSection from "./OrderDetailsSection";
import SupplierSelectionSection from "./SupplierSelectionSection";
import TotalAmountSection from "./TotalAmountSection";

const defaultValues: PurchaseOrderFormValues = {
  supplierName: "",
  orderDate: "2023-10-25",
  expectedDeliveryDate: "",
  shippingMethod: "standard",
  lineItems: [
    { skuName: "SF-MOD-402 - Core Processor", quantity: 25, unitPrice: 120 },
    {
      skuName: "SF-CAB-001 - High-Speed Cable",
      quantity: 100,
      unitPrice: 12.5,
    },
  ],
};

type PurchaseOrderFormProps = {
  mode: PurchaseOrderSidebarMode;
  initialValues?: Partial<PurchaseOrderFormValues>;
  onSubmit?: (values: PurchaseOrderFormValues) => void;
  onCancel?: () => void;
  onAddItemClick?: () => void;
  isSubmitting?: boolean;
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(merged);
  };

  return (
    <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        <SupplierSelectionSection supplierName={merged.supplierName} />
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
        submitLabel={
          mode === "create" ? "Create Purchase Order" : "Save Changes"
        }
      />
    </form>
  );
}
