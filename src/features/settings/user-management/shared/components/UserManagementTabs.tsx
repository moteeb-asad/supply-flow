"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

const TABS = [
  { href: "/settings/user-management", label: "Users" },
  { href: "/settings/user-management/invitations", label: "Invitations" },
];

// Users / Invitations tabs, shown at the top of each table card.
export default function UserManagementTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="User management" className="flex min-w-max gap-6">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px inline-flex h-11 items-center border-b-2 text-[13px] font-medium",
              isActive
                ? "border-ink text-ink"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
