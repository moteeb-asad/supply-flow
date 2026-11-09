"use client";

import AppIcon from "@/src/components/ui/AppIcon";
import type { AddItemModalProps } from "../../../types";
import AddItemForm from "./AddItemForm";

export default function AddItemModal({
  open,
  onClose,
  onAddItem,
  isSubmitting = false,
  submitError,
}: AddItemModalProps) {
  if (!open) {
    return null;
  }

  return (
    // z-[70]: opens on top of the purchase order drawer (z-40).
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/30 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-item-title"
        aria-describedby="add-item-description"
        className="flex w-full max-w-[520px] flex-col overflow-hidden rounded-sheet bg-surface shadow-overlay"
      >
        <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-5">
          <div>
            <h2
              id="add-item-title"
              className="text-lg font-semibold tracking-[-0.01em]"
            >
              Add item to purchase order
            </h2>
            <p
              id="add-item-description"
              className="mt-0.5 text-[13px] text-muted"
            >
              Select a product and specify details for this order.
            </p>
          </div>
          <button
            aria-label="Close"
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-control text-subtle hover:bg-background-light hover:text-ink"
            onClick={onClose}
            type="button"
          >
            <AppIcon name="close" />
          </button>
        </header>

        <AddItemForm
          isSubmitting={isSubmitting}
          onCancel={onClose}
          onSubmit={onAddItem}
          submitError={submitError}
        />
      </div>
    </div>
  );
}
