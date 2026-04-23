"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FormDrawer } from "@/src/components/ui/FormDrawer";
import type { InventoryItemFormValues } from "@/src/features/inventory/types/form.types";
import InventoryItemForm from "@/src/features/inventory/components/shared/InventoryItemForm";
import addInventoryItemAction from "../../actions/add-inventory-item.actions";
import type { AddInventoryItemDrawerProps } from "../../types/component-props.types";

export default function AddInventoryItemDrawer({
  onClose,
  onSuccess,
}: AddInventoryItemDrawerProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitValidationErrors, setSubmitValidationErrors] = useState<
    string[]
  >([]);

  const handleSubmit = (values: InventoryItemFormValues) => {
    startTransition(async () => {
      setSubmitError(null);
      setSubmitValidationErrors([]);

      const result = await addInventoryItemAction(values);

      if (!result.success) {
        setSubmitError(result.error ?? "Failed to add new inventory item.");
        setSubmitValidationErrors(result.validationErrors ?? []);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["inventory-items-table"],
      });
      onSuccess?.();
      onClose?.();
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
      <InventoryItemForm
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        onCancel={onClose}
      />
    </FormDrawer>
  );
}
