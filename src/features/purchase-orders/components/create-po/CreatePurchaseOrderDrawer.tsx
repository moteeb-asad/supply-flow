"use client";

import { FormDrawer } from "@/src/components/ui/FormDrawer";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { createPurchaseOrderAction } from "../../actions/create-purchaseorder.action";
import type {
  AddItemFormValues,
  CreatePurchaseOrderDrawerProps,
  PurchaseOrderFormValues,
} from "../../types";
import AddItemModal from "../shared/add-item-modal/AddItemModal";
import PurchaseOrderForm from "../shared/PurchaseOrderForm";

export default function CreatePurchaseOrderDrawer({
  onClose,
  onAddItemClick,
  onSuccess,
}: CreatePurchaseOrderDrawerProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitValidationErrors, setSubmitValidationErrors] = useState<
    string[]
  >([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [addItemSubmitError, setAddItemSubmitError] = useState<string | null>(
    null,
  );
  const [lineItems, setLineItems] = useState<
    PurchaseOrderFormValues["lineItems"]
  >([]);

  const handleSubmit = (values: PurchaseOrderFormValues) => {
    startTransition(async () => {
      setSubmitError(null);
      setSubmitValidationErrors([]);

      const result = await createPurchaseOrderAction(values);

      if (!result.success) {
        setSubmitError(result.error ?? "Failed to create purchase order.");
        setSubmitValidationErrors(result.validationErrors ?? []);
        return;
      }

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

  const handleAddItemClick = () => {
    if (isPending) return;
    setAddItemSubmitError(null);
    onAddItemClick?.();
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

  return (
    <>
      <FormDrawer
        description="Drafting a new order for procurement"
        onClose={onClose}
        showFooter={false}
        title="Create New Purchase Order"
      >
        {submitError ? (
          <div className="px-6 pt-4">
            <p className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
              {submitError}
            </p>
            {submitValidationErrors.length > 0 ? (
              <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitValidationErrors.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <PurchaseOrderForm
          initialValues={{ lineItems }}
          isSubmitting={isPending}
          mode="create"
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
