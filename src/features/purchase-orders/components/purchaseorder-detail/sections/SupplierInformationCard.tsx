import type { PurchaseOrder } from "../../../types";

type SupplierInformationCardProps = {
  purchaseOrder: PurchaseOrder;
};

export default function SupplierInformationCard({
  purchaseOrder,
}: SupplierInformationCardProps) {
  const contactName = purchaseOrder.supplier_contact_name ?? "N/A";
  const contactEmail = purchaseOrder.supplier_contact_email ?? "No email";
  const contactPhone = purchaseOrder.supplier_contact_phone ?? "No phone";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-base font-bold">Supplier Information</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-400">
            person
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {contactName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-400">mail</span>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {contactEmail}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-400">call</span>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {contactPhone}
          </p>
        </div>

        <button
          className="mt-2 w-full rounded-lg bg-primary/10 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
          type="button"
        >
          View Supplier History
        </button>
      </div>
    </div>
  );
}
