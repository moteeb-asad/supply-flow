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
  widthClassName?: string;
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
  widthClassName = "max-w-lg",
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
        className={`w-full ${widthClassName} flex h-full flex-col bg-white shadow-2xl transition-transform duration-300`}
      >
        <header className="z-10 flex items-center justify-between border-b border-[#e7ebf3] bg-white p-6">
          <div>
            <h3 className="text-xl font-bold text-[#0e121b]">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-[#4e6797]">{description}</p>
            ) : null}
          </div>
          <button
            className="cursor-pointer rounded-lg p-2 text-[#4e6797] transition-colors hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {children}

        {showFooter ? (
          <footer className="flex items-center justify-between gap-4 border-t border-[#e7ebf3] bg-white p-6">
            <Button
              className="w-auto rounded-lg bg-transparent px-6 py-2.5 text-sm font-bold text-[#4e6797] shadow-none transition-colors hover:bg-gray-50"
              onClick={onClose}
              type="button"
            >
              {cancelLabel}
            </Button>

            {submitLabel ? (
              <Button
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
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
                    <span className="material-symbols-outlined text-lg">
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
