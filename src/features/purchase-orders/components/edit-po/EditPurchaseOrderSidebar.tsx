"use client";

import { useTransition } from "react";
import type {
  EditPurchaseOrderSidebarProps,
  PurchaseOrderFormValues,
} from "../../types/purchase-orders.types";
import PurchaseOrderForm from "../shared/PurchaseOrderForm";
import PurchaseOrderSidebarShell from "../shared/PurchaseOrderSidebarShell";

export default function EditPurchaseOrderSidebar({
  purchaseOrder,
  onClose,
  onAddItemClick,
  onSuccess,
}: EditPurchaseOrderSidebarProps) {
  const [isPending, startTransition] = useTransition();

  const initialValues: Partial<PurchaseOrderFormValues> = {
    supplierId: purchaseOrder.supplier_id,
    supplierName: purchaseOrder.supplier_name,
    orderDate: purchaseOrder.order_date ?? "",
    expectedDeliveryDate: purchaseOrder.expected_delivery_date ?? "",
  };

  const handleSubmit = (_values: PurchaseOrderFormValues) => {
    startTransition(async () => {
      // TODO: wire updatePurchaseOrderAction when edit API is ready.
      onSuccess?.();
      onClose?.();
    });
  };

  return (
    <PurchaseOrderSidebarShell
      description="Update purchase order details and save changes."
      onClose={onClose}
      title="Edit Purchase Order"
    >
      <PurchaseOrderForm
        initialValues={initialValues}
        isSubmitting={isPending}
        mode="edit"
        onAddItemClick={onAddItemClick}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </PurchaseOrderSidebarShell>
  );
}
