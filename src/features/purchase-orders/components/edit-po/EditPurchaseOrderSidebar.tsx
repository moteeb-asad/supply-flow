"use client";

import { useState, useTransition } from "react";
import { updatePurchaseOrderAction } from "../../actions/update-purchaseorder.action";
import type {
  AddItemFormValues,
  EditPurchaseOrderSidebarProps,
  PurchaseOrderFormValues,
} from "../../types/purchase-orders.types";
import AddItemModal from "../shared/add-item-modal/AddItemModal";
import PurchaseOrderForm from "../shared/PurchaseOrderForm";
import { useQueryClient } from "@tanstack/react-query";
import PurchaseOrderSidebarShell from "../shared/PurchaseOrderSidebarShell";

export default function EditPurchaseOrderSidebar({
  purchaseOrder,
  onClose,
  onAddItemClick: _onAddItemClick,
  onSuccess,
}: EditPurchaseOrderSidebarProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [lineItems, setLineItems] = useState<
    PurchaseOrderFormValues["lineItems"]
  >(
    purchaseOrder.lineItems?.map((item) => ({
      skuName: item.sku_name,
      quantity: item.ordered_qty,
      unitPrice: item.unit_price,
    })) ?? [],
  );

  const initialValues: Partial<PurchaseOrderFormValues> = {
    supplierId: purchaseOrder.supplier_id,
    supplierName: purchaseOrder.supplier_name,
    orderDate: purchaseOrder.order_date ?? "",
    expectedDeliveryDate: purchaseOrder.expected_delivery_date ?? "",
    status: purchaseOrder.status,
    notes: purchaseOrder.notes ?? "",
    lineItems,
  };

  const handleAddItemClick = () => {
    _onAddItemClick?.();
    setIsAddItemModalOpen(true);
  };

  const handleAddItem = (item: AddItemFormValues) => {
    setLineItems((prev) => [...prev, item]);
    setIsAddItemModalOpen(false);
  };

  const handleSubmit = (values: PurchaseOrderFormValues) => {
    startTransition(async () => {
      setSubmitError(null);

      const result = await updatePurchaseOrderAction({
        purchaseOrderId: purchaseOrder.id,
        values,
      });

      if (!result.success) {
        setSubmitError(result.error ?? "Failed to update purchase order.");
        return;
      }

      // Invalidate purchase orders table and metrics queries
      await queryClient.invalidateQueries({
        queryKey: ["purchase-orders-table"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["purchase-orders-metrics"],
      });

      onSuccess?.();
      onClose?.();
    });
  };

  return (
    <>
      <PurchaseOrderSidebarShell
        description="Update purchase order details and save changes."
        onClose={onClose}
        title="Edit Purchase Order"
      >
        {submitError ? (
          <div className="px-6 pt-4">
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </p>
          </div>
        ) : null}

        <PurchaseOrderForm
          initialValues={initialValues}
          isSubmitting={isPending}
          mode="edit"
          onAddItemClick={handleAddItemClick}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </PurchaseOrderSidebarShell>

      <AddItemModal
        onAddItem={handleAddItem}
        onClose={() => setIsAddItemModalOpen(false)}
        open={isAddItemModalOpen}
      />
    </>
  );
}
