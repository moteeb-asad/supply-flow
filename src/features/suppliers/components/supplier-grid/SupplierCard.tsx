import Link from "next/link";
import { StatusPill } from "@/src/components/ui/StatusPill";
import { cn, getInitials } from "@/src/lib/utils";
import type { SupplierCardProps } from "@/src/features/suppliers/types/suppliers.types";
import { formatCategory } from "@/src/features/suppliers/utils/category";

export default function SupplierCard({ supplier }: SupplierCardProps) {
  const status = supplier.status ?? "active";
  const inactive = status === "inactive";

  return (
    <Link
      href={`/suppliers/${supplier.id}`}
      className="group flex h-full flex-col rounded-card border border-line p-5 hover:bg-background-light/50"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-control bg-neutral-soft text-[13px] font-semibold",
            inactive ? "text-muted" : "text-ink",
          )}
        >
          {getInitials(supplier.name)}
        </span>
        <StatusPill status={status} />
      </div>
      <p
        className={cn(
          "mt-4 text-[15px] font-semibold group-hover:underline",
          inactive && "text-muted",
        )}
      >
        {supplier.name}
      </p>
      <p className="text-[13px] text-subtle">
        {formatCategory(supplier.category)}
      </p>
      {/* mb-auto keeps the contact row at the bottom when cards share a row height. */}
      <dl className="mb-auto mt-5 grid grid-cols-2 gap-3 text-[13px]">
        <div>
          <dt className="text-subtle">Lead time</dt>
          <dd
            className={cn(
              "mt-0.5 font-medium tabular-nums",
              inactive && "text-muted",
            )}
          >
            {supplier.lead_time_days != null
              ? `${supplier.lead_time_days} days`
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-subtle">Min order</dt>
          <dd
            className={cn(
              "mt-0.5 font-medium tabular-nums",
              inactive && "text-muted",
            )}
          >
            {supplier.min_order_qty != null
              ? `${supplier.min_order_qty} units`
              : "—"}
          </dd>
        </div>
      </dl>
      <p className="mt-5 flex items-center justify-between border-t border-line-soft pt-3 text-[13px] text-muted">
        {supplier.primary_contact_name ?? "No contact"}
        <span
          aria-hidden="true"
          className="material-symbols-outlined !text-[16px] text-subtle group-hover:text-ink"
        >
          chevron_right
        </span>
      </p>
    </Link>
  );
}
