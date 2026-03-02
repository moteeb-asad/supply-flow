import type { ReactNode } from "react";
import { Button } from "@/src/components/ui/Button";

type SupplierDrawerProps = {
  title: string;
  description: string;
  submitLabel: string;
  formId: string;
  onClose?: () => void;
  children: ReactNode;
};

export function SupplierDrawer({
  title,
  description,
  submitLabel,
  formId,
  onClose,
  children,
}: SupplierDrawerProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[1px] flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-[#1a1f2e] h-full shadow-2xl flex flex-col transition-transform duration-300">
        <div className="p-6 border-b border-[#e7ebf3] dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1a1f2e] z-10">
          <div>
            <h3 className="text-xl font-bold text-[#0e121b] dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-[#4e6797] mt-1">{description}</p>
          </div>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-[#4e6797] transition-colors"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {children}

        <div className="p-6 border-t border-[#e7ebf3] dark:border-gray-800 bg-white dark:bg-[#1a1f2e] flex items-center justify-between gap-4">
          <Button
            className="px-6 py-2.5 text-sm font-bold text-[#4e6797] hover:bg-gray-50 bg-transparent w-auto shadow-none rounded-lg transition-colors"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            form={formId}
            type="submit"
          >
            <span>{submitLabel}</span>
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
