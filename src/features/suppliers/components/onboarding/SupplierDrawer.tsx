import { Button } from "@/src/components/ui/Button";
import type { SupplierDrawerProps } from "@/src/features/suppliers/types/suppliers.types";

export function SupplierDrawer({
  title,
  description,
  submitLabel,
  submittingLabel = "Onboarding...",
  formId,
  isSubmitting = false,
  onClose,
  children,
}: SupplierDrawerProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[1px] flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transition-transform duration-300">
        <div className="p-6 border-b border-[#e7ebf3] flex items-center justify-between bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-[#0e121b]">
              {title}
            </h3>
            <p className="text-sm text-[#4e6797] mt-1">{description}</p>
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg text-[#4e6797] transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {children}

        <div className="p-6 border-t border-[#e7ebf3] bg-white flex items-center justify-between gap-4">
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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
        </div>
      </div>
    </div>
  );
}
