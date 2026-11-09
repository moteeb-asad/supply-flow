"use client";

import { FormDrawer } from "@/src/components/ui/FormDrawer";
import { useQueryClient } from "@tanstack/react-query";
import { purchaseOrderKeys } from "@/src/features/purchase-orders/constants/query-keys";
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
import TotalAmountSection from "../shared/TotalAmountSection";
import {
  calculatePurchaseOrderTotals,
  type PurchaseOrderTotals,
} from "../../utils/calculations";

export default function CreatePurchaseOrderDrawer({
  onClose,
  onAddItemClick,
  onSuccess,
}: CreatePurchaseOrderDrawerProps) {
  const queryClient = useQueryClient();
  const [state, formAction] = useActionState(
    createPurchaseOrderAction,
    undefined,
  );
  const [isPending, startTransition] = useTransition();
  const [totals, setTotals] = useState<PurchaseOrderTotals>(() =>
    calculatePurchaseOrderTotals([], "cod"),
  );
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
      void queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      onSuccess?.();
      onClose?.();
    }
  }, [state?.success, state?.purchaseOrderId, queryClient, onClose, onSuccess]);

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
        title="New purchase order"
        description="Draft a new order for procurement."
        onClose={onClose}
        submitLabel="Create purchase order"
        submittingLabel="Creating..."
        isSubmitting={isPending}
        formId={PURCHASE_ORDER_FORM_ID}
        footerContent={<TotalAmountSection {...totals} />}
      >
        <PurchaseOrderForm
          mode="create"
          formId={PURCHASE_ORDER_FORM_ID}
          serverError={state?.error}
          isSubmitting={isPending}
          onSubmit={handleDrawerSubmit}
          onAddItemClick={handleAddItemClick}
          onTotalsChange={setTotals}
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
