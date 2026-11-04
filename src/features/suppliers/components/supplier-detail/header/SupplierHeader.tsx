import type { SupplierHeaderProps } from "@/src/features/suppliers/types/suppliers.types";
import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import { StatusPill } from "@/src/components/ui/StatusPill";
import { getInitials } from "@/src/lib/utils";
import { useUser } from "@/src/providers/UserProvider";
import { hasPermission } from "@/src/features/auth/utils/rbac";

const contactIconClassName =
  "material-symbols-outlined !text-[16px] text-subtle";

export default function SupplierHeader({
  supplier,
  onEditClick,
}: SupplierHeaderProps) {
  const { user } = useUser();
  const canManageSuppliers = hasPermission(
    user?.primaryRole,
    "suppliers:manage",
  );
  const status = supplier.status ?? "active";

  const email = supplier.primary_contact_email ?? "No email";
  const phone = supplier.primary_contact_phone ?? "No phone";

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[13px]"
      >
        <Link className="text-muted hover:text-ink" href="/suppliers">
          Suppliers
        </Link>
        <span
          aria-hidden="true"
          className="material-symbols-outlined !text-[16px] text-subtle"
        >
          chevron_right
        </span>
        <span aria-current="page" className="text-ink">
          {supplier.name}
        </span>
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden="true"
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-card bg-neutral-soft text-base font-semibold"
          >
            {getInitials(supplier.name)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-[-0.01em]">
                {supplier.name}
              </h1>
              <StatusPill status={status} />
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className={contactIconClassName}>
                  mail
                </span>
                {email}
              </span>
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <span aria-hidden="true" className={contactIconClassName}>
                  call
                </span>
                {phone}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="md">
            <span
              aria-hidden="true"
              className="material-symbols-outlined !text-[18px]"
            >
              download
            </span>
            Export report
          </Button>
          {canManageSuppliers && (
            <Button size="md" onClick={onEditClick} type="button">
              <span
                aria-hidden="true"
                className="material-symbols-outlined !text-[18px]"
              >
                edit
              </span>
              Edit supplier
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
