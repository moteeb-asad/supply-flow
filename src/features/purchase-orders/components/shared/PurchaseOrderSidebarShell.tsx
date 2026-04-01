import type { PurchaseOrderSidebarShellProps } from "../../types";

export default function PurchaseOrderSidebarShell({
  title,
  description,
  onClose,
  children,
}: PurchaseOrderSidebarShellProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-20"></div>
      <aside className="fixed top-0 right-0 h-full w-full max-w-[580px] bg-white dark:bg-slate-900 shadow-2xl z-30 flex flex-col border-l border-slate-200 dark:border-slate-800">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <button
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-slate-500">
              close
            </span>
          </button>
        </div>

        {children}
      </aside>
    </>
  );
}
