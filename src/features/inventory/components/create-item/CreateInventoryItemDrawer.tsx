"use client";

import { useState } from "react";

import { FormDrawer } from "@/src/components/ui/FormDrawer";
import InventoryItemForm, {
  INVENTORY_ITEM_FORM_ID,
  type InventoryItemFormValues,
} from "@/src/features/inventory/components/shared/InventoryItemForm";

type CreateInventoryItemDrawerProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function CreateInventoryItemDrawer({
  open = false,
  onClose,
}: CreateInventoryItemDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setIsSubmitting(false);
    onClose?.();
  };

  const handleSubmit = (_values: InventoryItemFormValues) => {
    setIsSubmitting(true);

    // Placeholder until inventory create action is wired.
    setTimeout(() => {
      setIsSubmitting(false);
      handleClose();
    }, 250);
  };

  return (
    <FormDrawer
      open={open}
      title="Add New Inventory Item"
      description="Register a new product in the central warehouse system"
      onClose={handleClose}
      submitLabel="Add Item"
      submittingLabel="Adding..."
      formId={INVENTORY_ITEM_FORM_ID}
      isSubmitting={isSubmitting}
    >
      <InventoryItemForm onSubmit={handleSubmit} />
    </FormDrawer>
  );
}
