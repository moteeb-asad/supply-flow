"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/src/lib/navigation";

type SidebarNavLinkProps = {
  href: string;
  icon: string;
  label: string;
};

export default function SidebarNavLink({
  href,
  icon,
  label,
}: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
        isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-gray-100"
      }`}
    >
      <span
        className="material-symbols-outlined !text-[20px]"
        style={isActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}
