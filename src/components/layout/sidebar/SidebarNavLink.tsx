"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/src/lib/navigation";
import { cn } from "@/src/lib/utils";
import AppIcon, { type AppIconName } from "@/src/components/ui/AppIcon";

type SidebarNavLinkProps = {
  href: string;
  icon: AppIconName;
  label: string;
  count?: number;
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
      <AppIcon
        name={icon}
        className={cn(
          "size-[18px] shrink-0",
          isActive ? "text-ink" : "text-subtle",
        )}
      />

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
