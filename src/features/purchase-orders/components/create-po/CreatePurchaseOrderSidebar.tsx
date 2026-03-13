"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPurchaseOrderAction } from "../../actions/create-purchaseorder.action";
import type {
  AddItemFormValues,
  CreatePurchaseOrderSidebarProps,
  PurchaseOrderFormValues,
} from "../../types/purchase-orders.types";
import AddItemModal from "../shared/add-item-modal/AddItemModal";
import PurchaseOrderForm from "../shared/PurchaseOrderForm";
import PurchaseOrderSidebarShell from "../shared/PurchaseOrderSidebarShell";

export default function CreatePurchaseOrderSidebar({
  onClose,
  onAddItemClick,
  onSuccess,
}: CreatePurchaseOrderSidebarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [lineItems, setLineItems] = useState<
    PurchaseOrderFormValues["lineItems"]
  >([]);

  const handleSubmit = (values: PurchaseOrderFormValues) => {
    startTransition(async () => {
      setSubmitError(null);

      const result = await createPurchaseOrderAction(values);

      if (!result.success) {
        setSubmitError(result.error ?? "Failed to create purchase order.");
        return;
      }

      router.refresh();
      onSuccess?.();
      onClose?.();
    });
  };

  const handleAddItemClick = () => {
    onAddItemClick?.();
    setIsAddItemModalOpen(true);
  };

  const handleAddItem = (item: AddItemFormValues) => {
    setLineItems((prev) => [...prev, item]);
    setIsAddItemModalOpen(false);
  };

  return (
    <>
      <PurchaseOrderSidebarShell
        description="Drafting a new order for procurement"
        onClose={onClose}
        title="Create New Purchase Order"
      >
        {submitError ? (
          <div className="px-6 pt-4">
            <p className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
              {submitError}
            </p>
          </div>
        ) : null}

        <PurchaseOrderForm
          initialValues={{ lineItems }}
          isSubmitting={isPending}
          mode="create"
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
