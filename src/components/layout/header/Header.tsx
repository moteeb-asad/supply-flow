"use client";

import { usePathname } from "next/navigation";
import { getPageTitle } from "@/src/lib/page-titles";
import DynamicHeader from "./DynamicHeader";

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line-soft bg-white px-6">
      <h2 className="text-lg font-semibold tracking-tight">{pageTitle}</h2>

      {/* Dynamic header content (search, action buttons) per route */}
      <DynamicHeader />
    </header>
  );
}
