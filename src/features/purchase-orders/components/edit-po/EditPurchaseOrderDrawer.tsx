"use client";

import { FormDrawer } from "@/src/components/ui/FormDrawer";
import { useQueryClient } from "@tanstack/react-query";
import {
  useActionState,
  useState,
  useTransition,
  useRef,
  useEffect,
} from "react";
import { updatePurchaseOrderAction } from "../../actions/update-purchaseorder.action";
import type {
  AddItemFormValues,
  EditPurchaseOrderDrawerProps,
  PurchaseOrderFormValues,
} from "../../types";
import AddItemModal from "../shared/add-item-modal/AddItemModal";
import PurchaseOrderForm, {
  PURCHASE_ORDER_FORM_ID,
} from "../shared/PurchaseOrderForm";
import type { UseFieldArrayAppend } from "react-hook-form";

export default function EditPurchaseOrderDrawer({
  purchaseOrder,
  onClose,
  onAddItemClick,
  onSuccess,
}: EditPurchaseOrderDrawerProps) {
  const queryClient = useQueryClient();
  const [state, formAction] = useActionState(
    updatePurchaseOrderAction,
    undefined,
  );
  const [isPending, startTransition] = useTransition();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [addItemSubmitError, setAddItemSubmitError] = useState<string | null>(
    null,
  );
  const appendLineItemRef = useRef<UseFieldArrayAppend<
    PurchaseOrderFormValues,
    "lineItems"
  > | null>(null);

  const initialValues: Partial<PurchaseOrderFormValues> = {
    supplierId: purchaseOrder.supplier_id,
    supplierName: purchaseOrder.supplier_name,
    orderDate: purchaseOrder.order_date ?? "",
    expectedDeliveryDate: purchaseOrder.expected_delivery_date ?? "",
    paymentMethod: purchaseOrder.payment_method,
    status: purchaseOrder.status,
    notes: purchaseOrder.notes ?? "",
    lineItems:
      purchaseOrder.lineItems?.map((item) => ({
        skuName: item.sku_name,
        quantity: item.ordered_qty,
        unitPrice: item.unit_price,
      })) ?? [],
  };

  useEffect(() => {
    if (state?.success && state?.purchaseOrderId) {
      void queryClient.invalidateQueries({
        queryKey: ["purchase-orders-table"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["purchase-orders-metrics"],
      });
      onSuccess?.();
      onClose?.();
    }
  }, [state?.success, state?.purchaseOrderId, queryClient, onClose, onSuccess]);

  const handleDrawerSubmit = async (values: PurchaseOrderFormValues) => {
    const formData = new FormData();
    formData.append("purchaseOrderId", purchaseOrder.id);
    formData.append("supplierId", values.supplierId);
    formData.append("supplierName", values.supplierName ?? "");
    formData.append("orderDate", values.orderDate);
    formData.append("expectedDeliveryDate", values.expectedDeliveryDate ?? "");
    formData.append("shippingMethod", values.shippingMethod);
    formData.append("status", values.status);
    formData.append("paymentMethod", values.paymentMethod);
    formData.append("notes", values.notes ?? "");
    formData.append("lineItems", JSON.stringify(values.lineItems));
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleAddItemClick = () => {
    if (isPending) return;
    setAddItemSubmitError(null);
    onAddItemClick?.();
    setIsAddItemModalOpen(true);
  };

  const handleAddItem = (item: AddItemFormValues) => {
    if (!appendLineItemRef.current) return;

    appendLineItemRef.current(item);
    setAddItemSubmitError(null);
    setIsAddItemModalOpen(false);
  };

  return (
    <>
      <FormDrawer
        title="Edit Purchase Order"
        description="Update purchase order details and save changes"
        onClose={onClose}
        submitLabel="Update Purchase Order"
        submittingLabel="Updating..."
        isSubmitting={isPending}
        formId={PURCHASE_ORDER_FORM_ID}
      >
        <PurchaseOrderForm
          mode="edit"
          formId={PURCHASE_ORDER_FORM_ID}
          serverError={state?.error}
          isSubmitting={isPending}
          initialValues={initialValues}
          onSubmit={handleDrawerSubmit}
          onAddItemClick={handleAddItemClick}
          onFieldArrayReady={(methods) => {
            appendLineItemRef.current = methods.append;
          }}
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
