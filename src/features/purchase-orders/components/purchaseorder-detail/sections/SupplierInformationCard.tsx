import AppIcon, { type AppIconName } from "@/src/components/ui/AppIcon";
import type { PurchaseOrder } from "../../../types";

type SupplierInformationCardProps = {
  purchaseOrder: PurchaseOrder;
};

export default function SupplierInformationCard({
  purchaseOrder,
}: SupplierInformationCardProps) {
  const contactName = purchaseOrder.supplier_contact_name ?? "N/A";
  const contactEmail = purchaseOrder.supplier_contact_email;
  const contactPhone = purchaseOrder.supplier_contact_phone ?? "No phone";

  const rows: Array<{
    label: string;
    icon: AppIconName;
    value: React.ReactNode;
  }> = [
    { label: "Contact", icon: "person", value: contactName },
    {
      label: "Email",
      icon: "mail",
      value: contactEmail ? (
        <a
          href={`mailto:${contactEmail}`}
          className="text-primary hover:underline"
        >
          {contactEmail}
        </a>
      ) : (
        "No email"
      ),
    },
    {
      label: "Phone",
      icon: "phone",
      value: <span className="tabular-nums">{contactPhone}</span>,
    },
  ];

  return (
    <section
      aria-labelledby="po-supplier-title"
      className="rounded-card border border-line p-5"
    >
      <h2 id="po-supplier-title" className="text-[15px] font-semibold">
        Supplier contact
      </h2>

      <dl className="mt-3 space-y-2.5 text-[13px]">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2.5">
            <dt className="sr-only">{row.label}</dt>
            <AppIcon name={row.icon} className="size-4 shrink-0 text-subtle" />
            <dd className="truncate">{row.value}</dd>
          </div>
        ))}
      </dl>

      <button
        className="mt-4 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-control border border-line text-[13px] font-medium text-ink hover:bg-background-light"
        type="button"
      >
        View supplier history
      </button>
    </section>
  );
}
