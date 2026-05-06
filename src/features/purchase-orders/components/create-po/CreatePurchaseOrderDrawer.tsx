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
import { createPurchaseOrderAction } from "../../actions/create-purchaseorder.action";
import type {
  AddItemFormValues,
  CreatePurchaseOrderDrawerProps,
  PurchaseOrderFormValues,
} from "../../types";
import AddItemModal from "../shared/add-item-modal/AddItemModal";
import PurchaseOrderForm, {
  PURCHASE_ORDER_FORM_ID,
} from "../shared/PurchaseOrderForm";
import type { UseFieldArrayAppend } from "react-hook-form";

export default function CreatePurchaseOrderDrawer({
  onClose,
  onAddItemClick,
}: CreatePurchaseOrderDrawerProps) {
  const queryClient = useQueryClient();
  const [state, formAction] = useActionState(
    createPurchaseOrderAction,
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

  useEffect(() => {
    if (state?.success && state?.purchaseOrderId) {
      void queryClient.invalidateQueries({
        queryKey: ["purchase-orders-table"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["purchase-orders-metrics"],
      });
      onClose?.();
    }
  }, [state?.success, state?.purchaseOrderId, queryClient, onClose]);

  const handleDrawerSubmit = async (values: PurchaseOrderFormValues) => {
    const formData = new FormData();
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
        title="Create New Purchase Order"
        description="Drafting a new order for procurement"
        onClose={onClose}
        submitLabel="Create Purchase Order"
        submittingLabel="Creating..."
        isSubmitting={isPending}
        formId={PURCHASE_ORDER_FORM_ID}
      >
        <PurchaseOrderForm
          mode="create"
          formId={PURCHASE_ORDER_FORM_ID}
          serverError={state?.error}
          isSubmitting={isPending}
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
