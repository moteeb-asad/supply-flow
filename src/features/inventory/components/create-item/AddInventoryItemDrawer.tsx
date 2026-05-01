"use client";

import { useActionState, useState, useTransition } from "react";
import { FormDrawer } from "@/src/components/ui/FormDrawer";
import type { InventoryItemFormValues } from "@/src/features/inventory/types/form.types";
import InventoryItemForm, {
  INVENTORY_FORM_ID,
} from "@/src/features/inventory/components/shared/InventoryItemForm";
import addInventoryItemAction from "../../actions/add-inventory-item.actions";
import type { AddInventoryItemDrawerProps } from "../../types/component-props.types";

export default function AddInventoryItemDrawer({
  onClose,
}: AddInventoryItemDrawerProps) {
  const [state, formAction] = useActionState(addInventoryItemAction, undefined);
  const [isPending, startTransition] = useTransition();
  const formKey = state?.resetKey ?? "initial";

  const handleDrawerSubmit = (values: InventoryItemFormValues) => {
    const formData = new FormData();
    formData.append("itemName", values.itemName);
    formData.append("skuCode", values.skuCode);
    formData.append("unit", values.unit);
    formData.append("category", values.category);
    formData.append("initialStock", String(values.initialStock));
    formData.append("unitPrice", String(values.unitPrice));
    formData.append("primarySupplier", values.primarySupplier);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <FormDrawer
      title="Add New Inventory Item"
      description="Register a new product in the central warehouse system"
      onClose={onClose}
      submitLabel="Add Item"
      submittingLabel="Adding..."
      isSubmitting={isPending}
      formId={INVENTORY_FORM_ID}
    >
      <InventoryItemForm
        key={formKey}
        formId={INVENTORY_FORM_ID}
        onSubmit={handleDrawerSubmit}
        serverError={state?.error}
        isSubmitting={isPending}
      />
    </FormDrawer>
  );
}
