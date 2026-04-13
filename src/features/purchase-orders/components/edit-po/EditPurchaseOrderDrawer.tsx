"use client";

import { FormDrawer } from "@/src/components/ui/FormDrawer";
import { useState, useTransition } from "react";
import { updatePurchaseOrderAction } from "../../actions/update-purchaseorder.action";
import type {
  AddItemFormValues,
  EditPurchaseOrderDrawerProps,
  PurchaseOrderFormValues,
} from "../../types";
import AddItemModal from "../shared/add-item-modal/AddItemModal";
import PurchaseOrderForm from "../shared/PurchaseOrderForm";
import { useQueryClient } from "@tanstack/react-query";

export default function EditPurchaseOrderDrawer({
  purchaseOrder,
  onClose,
  onAddItemClick: _onAddItemClick,
  onSuccess,
}: EditPurchaseOrderDrawerProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [addItemSubmitError, setAddItemSubmitError] = useState<string | null>(
    null,
  );
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
    paymentMethod: purchaseOrder.payment_method,
    status: purchaseOrder.status,
    notes: purchaseOrder.notes ?? "",
    lineItems,
  };

  const handleAddItemClick = () => {
    setAddItemSubmitError(null);
    _onAddItemClick?.();
    setIsAddItemModalOpen(true);
  };

  const handleAddItem = (item: AddItemFormValues) => {
    const normalizedSkuName = item.skuName.trim().toLowerCase();
    const alreadyExists = lineItems.some(
      (lineItem) => lineItem.skuName.trim().toLowerCase() === normalizedSkuName,
    );

    if (alreadyExists) {
      setAddItemSubmitError(
        "This item already exists in line items. Edit its quantity or unit price instead.",
      );
      return;
    }

    setLineItems((prev) => [...prev, item]);
    setAddItemSubmitError(null);
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
      <FormDrawer
        description="Update purchase order details and save changes."
        onClose={onClose}
        showFooter={false}
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
          onLineItemsChange={setLineItems}
          onSubmit={handleSubmit}
        />
      </FormDrawer>

      <AddItemModal
        onAddItem={handleAddItem}
        onClose={() => {
          setAddItemSubmitError(null);
          setIsAddItemModalOpen(false);
        }}
        open={isAddItemModalOpen}
        submitError={addItemSubmitError}
      />
    </>
  );
}
