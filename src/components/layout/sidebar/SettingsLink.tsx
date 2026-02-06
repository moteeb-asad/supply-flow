"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/src/lib/navigation";

export default function SettingsLink() {
  const pathname = usePathname();
  const isActive = isActivePath(pathname, "/settings");

  return (
    <Link
      href="/settings"
      className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-[#4e6797] hover:bg-gray-100"
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={isActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
      >
        settings
      </span>
      <span>Settings</span>
    </Link>
  );
}
