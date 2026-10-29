"use client";

import React from "react";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
};

export function Modal({
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[480px] overflow-hidden rounded-sheet bg-surface shadow-overlay">
        {(title || description) && (
          <div className="px-6 pb-2 pt-5">
            {title && (
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-ink">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-[13px] text-muted">{description}</p>
            )}
          </div>
        )}

        {children && <div className="px-6 py-4">{children}</div>}

        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-line bg-background-light px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
