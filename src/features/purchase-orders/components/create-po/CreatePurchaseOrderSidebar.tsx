"use client";

import { useTransition } from "react";
import type { PurchaseOrderFormValues } from "../../types/purchase-orders.types";
import PurchaseOrderForm from "../shared/PurchaseOrderForm";
import PurchaseOrderSidebarShell from "../shared/PurchaseOrderSidebarShell";

type CreatePurchaseOrderSidebarProps = {
  onClose?: () => void;
  onAddItemClick?: () => void;
  onSuccess?: () => void;
};

export default function CreatePurchaseOrderSidebar({
  onClose,
  onAddItemClick,
  onSuccess,
}: CreatePurchaseOrderSidebarProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (_values: PurchaseOrderFormValues) => {
    startTransition(async () => {
      // TODO: wire createPurchaseOrderAction when create API is ready.
      onSuccess?.();
      onClose?.();
    });
  };

  return (
    <PurchaseOrderSidebarShell
      description="Drafting a new order for procurement"
      onClose={onClose}
      title="Create New Purchase Order"
    >
      <PurchaseOrderForm
        isSubmitting={isPending}
        mode="create"
        onAddItemClick={onAddItemClick}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </PurchaseOrderSidebarShell>
  );
}
