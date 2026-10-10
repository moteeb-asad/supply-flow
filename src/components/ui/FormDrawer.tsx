import React from "react";

import { Button } from "@/src/components/ui/Button";

type FormDrawerProps = {
  open?: boolean;
  title: string;
  description?: string;
  onClose?: () => void;
  children: React.ReactNode;
  formId?: string;
  submitLabel?: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
  cancelLabel?: string;
  showFooter?: boolean;
};

export function FormDrawer({
  open = true,
  title,
  description,
  onClose,
  children,
  formId,
  submitLabel,
  submittingLabel = "Saving...",
  isSubmitting = false,
  cancelLabel = "Cancel",
  showFooter = true,
}: FormDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-[1px]"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <aside
        className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300"
      >
        <header className="z-10 flex items-center justify-between gap-3 border-b border-line-soft bg-white px-5 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-ink">{title}</h3>
            {description ? (
              <p className="truncate text-sm text-muted">{description}</p>
            ) : null}
          </div>
          <button
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <span className="material-symbols-outlined !text-[20px]">
              close
            </span>
          </button>
        </header>

        {children}

        {showFooter ? (
          <footer className="flex items-center justify-between gap-3 border-t border-line-soft bg-white px-5 py-3">
            <Button
              className="w-auto rounded-lg bg-transparent px-4 py-2 text-sm font-bold text-muted shadow-none transition-colors hover:bg-gray-50"
              onClick={onClose}
              type="button"
            >
              {cancelLabel}
            </Button>

            {submitLabel ? (
              <Button
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary/90"
                form={formId}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>{submittingLabel}</span>
                  </span>
                ) : (
                  <>
                    <span>{submitLabel}</span>
                    <span className="material-symbols-outlined !text-[18px]">
                      arrow_forward
                    </span>
                  </>
                )}
              </Button>
            ) : null}
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
