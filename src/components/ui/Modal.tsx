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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[480px] overflow-hidden rounded-xl border border-[#e7ebf3] bg-white shadow-2xl">
        {(title || description) && (
          <div className="px-8 pt-8 pb-4">
            {title && (
              <h2 className="text-xl font-bold text-[#0e121b]">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-[#4e6797]">{description}</p>
            )}
          </div>
        )}

        {children && <div className="px-8 py-4">{children}</div>}

        {footer && (
          <div className="flex flex-col gap-3 px-8 pt-4 pb-8 sm:flex-row">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
