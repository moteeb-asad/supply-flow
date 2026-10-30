import React from "react";

import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";

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
  // "md" 520px for most forms, "lg" 640px for forms with a line-item grid
  // (SKU receiving).
  size?: "md" | "lg";
  // Optional content above the buttons, e.g. order totals.
  footerContent?: React.ReactNode;
};

const widths = {
  md: "max-w-[520px]",
  lg: "max-w-[640px]",
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
  size = "md",
  footerContent,
}: FormDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 bg-ink/30"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <aside
        className={cn(
          "absolute inset-y-2 right-2 flex w-[calc(100%-16px)] flex-col overflow-hidden rounded-sheet bg-surface shadow-overlay",
          widths[size],
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-[-0.01em] text-ink">
              {title}
            </h3>
            {description ? (
              <p className="mt-0.5 text-[13px] text-muted">{description}</p>
            ) : null}
          </div>
          <button
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-control text-subtle transition-colors hover:bg-background-light hover:text-ink"
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
          <footer className="border-t border-line bg-background-light px-6 py-4">
            {footerContent ? <div className="mb-4">{footerContent}</div> : null}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="md"
                className="hover:bg-surface"
                onClick={onClose}
                type="button"
              >
                {cancelLabel}
              </Button>

              {submitLabel ? (
                <Button
                  size="md"
                  className="px-4"
                  form={formId}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>{submittingLabel}</span>
                    </span>
                  ) : (
                    submitLabel
                  )}
                </Button>
              ) : null}
            </div>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
