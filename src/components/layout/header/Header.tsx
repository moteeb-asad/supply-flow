"use client";

import { usePathname } from "next/navigation";
import { getPageTitle } from "@/src/lib/page-titles";
import DynamicHeader from "./DynamicHeader";

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    // Transparent: it sits inside the white sheet, so its corners stay round.
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line px-8">
      <h1 className="text-lg font-semibold tracking-[-0.01em] text-ink">
        {pageTitle}
      </h1>

      {/* Dynamic header content (search, action buttons) per route */}
      <DynamicHeader />
    </header>
  );
}
