import Link from "next/link";
import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";
import { redirect } from "next/navigation";
import {
  getRoleFromAppMetadata,
  hasPermission,
} from "@/src/features/auth/utils/rbac";
import AppIcon, { type AppIconName } from "@/src/components/ui/AppIcon";

type SettingsItem = {
  label: string;
  description: string;
  icon: AppIconName;
  // No href: shown as "Soon" and not clickable.
  href?: string;
};

function SettingsIcon({ name }: { name: AppIconName }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-control bg-background-light text-subtle group-hover:bg-surface"
    >
      <AppIcon name={name} />
    </span>
  );
}

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const role = getRoleFromAppMetadata(user.app_metadata);
  const canManageUsers = hasPermission(role, "users:manage");

  const items: SettingsItem[] = [
    {
      label: "Account",
      description: "Your name, email and password",
      icon: "person",
      href: "/settings/account",
    },
    ...(canManageUsers
      ? [
          {
            label: "User management",
            description: "Staff, roles and invitations",
            icon: "users" as const,
            href: "/settings/user-management",
          },
        ]
      : []),
    {
      label: "Notifications",
      description: "Alerts for low stock, late orders and receiving variances",
      icon: "bell",
    },
    {
      label: "Data and export",
      description: "Retention, backups and bulk exports",
      icon: "database",
    },
  ];

  return (
    <>
      <header className="px-8 pb-6 pt-8">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Your account, and who can use SupplyFlow.
        </p>
      </header>

      <div className="px-8 pb-8">
        <ul className="max-w-3xl divide-y divide-line-soft overflow-hidden rounded-card border border-line">
          {items.map((item) =>
            item.href ? (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-4 px-5 py-4 hover:bg-background-light"
                >
                  <SettingsIcon name={item.icon} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {item.label}
                    </span>
                    <span className="block text-[13px] text-muted">
                      {item.description}
                    </span>
                  </span>
                  <AppIcon
                    name="chevronRight"
                    className="size-4 shrink-0 text-subtle group-hover:text-ink"
                  />
                </Link>
              </li>
            ) : (
              <li
                key={item.label}
                className="flex items-center gap-4 px-5 py-4"
              >
                <SettingsIcon name={item.icon} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-medium text-muted">
                    {item.label}
                    <span className="rounded-full border border-line px-1.5 text-[11px] font-normal leading-4 text-subtle">
                      Soon
                    </span>
                  </span>
                  <span className="block text-[13px] text-subtle">
                    {item.description}
                  </span>
                </span>
              </li>
            ),
          )}
        </ul>
      </div>
    </>
  );
}
