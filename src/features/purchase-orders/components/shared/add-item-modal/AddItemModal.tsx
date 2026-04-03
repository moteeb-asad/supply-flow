"use client";

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[560px] rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              Add Item to Purchase Order
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select a product and specify details for this order.
            </p>
          </div>
          <button
            className="text-slate-400 hover:text-slate-600 transition-colors"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

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
