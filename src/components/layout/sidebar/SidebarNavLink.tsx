"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/src/lib/navigation";
import { cn } from "@/src/lib/utils";

type SidebarNavLinkProps = {
  href: string;
  icon: string;
  label: string;
  // Number shown at the right, e.g. open purchase orders.
  count?: number;
  // Small pill shown at the right, e.g. "Soon".
  badge?: string;
};

export default function SidebarNavLink({
  href,
  icon,
  label,
  count,
  badge,
}: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-8 items-center gap-2.5 rounded-control px-2.5 text-[13px] font-medium transition-colors",
        isActive
          ? "bg-surface text-ink shadow-raised"
          : "text-muted hover:bg-surface/70 hover:text-ink",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "material-symbols-outlined !text-[18px]",
          isActive ? "text-ink" : "text-subtle",
        )}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
      {badge ? (
        <span className="ml-auto rounded-full border border-line px-1.5 text-[11px] leading-4 text-subtle">
          {badge}
        </span>
      ) : count !== undefined ? (
        <span className="ml-auto text-xs tabular-nums text-subtle">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
