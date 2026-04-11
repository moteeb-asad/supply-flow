"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/src/lib/navigation";
import type { SidebarMenuItem } from "@/src/types/navigation";

type SidebarNavProps = {
  items: SidebarMenuItem[];
};

export default function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
      {items.map((item) => {
        const isActive = isActivePath(pathname, item.path);

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-[#4e6797] hover:bg-gray-100"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={
                isActive ? { fontVariationSettings: '"FILL" 1' } : undefined
              }
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
