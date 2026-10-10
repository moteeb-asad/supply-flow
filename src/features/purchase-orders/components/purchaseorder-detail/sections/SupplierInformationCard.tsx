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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold">Supplier Information</h3>

      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[18px] text-slate-400">
            person
          </span>
          <p className="truncate text-sm text-slate-600">
            {contactName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[18px] text-slate-400">mail</span>
          <p className="truncate text-sm text-slate-600">
            {contactEmail}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[18px] text-slate-400">call</span>
          <p className="truncate text-sm text-slate-600">
            {contactPhone}
          </p>
        </div>

        <button
          className="mt-1 w-full rounded-lg bg-primary/10 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
          type="button"
        >
          View Supplier History
        </button>
      </div>
    </div>
  );
}
