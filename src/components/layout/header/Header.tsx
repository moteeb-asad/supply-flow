"use client";

import { logoutAction } from "@/src/features/auth/actions/auth.actions";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { getPageTitle } from "@/src/lib/page-titles";
import DynamicHeader from "./DynamicHeader";

const iconButtonClassName =
  "relative flex size-9 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50";

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line-soft bg-white px-6">
      <h2 className="text-lg font-semibold tracking-tight">{pageTitle}</h2>

      <div className="flex items-center gap-2">
        {/* Dynamic header content (search, action buttons) per route */}
        <DynamicHeader />

        <button
          className={iconButtonClassName}
          title="Notifications"
          type="button"
        >
          <span className="material-symbols-outlined !text-[20px]">
            notifications
          </span>
          <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-danger" />
        </button>

        <button
          className={iconButtonClassName}
          disabled={isLoggingOut}
          onClick={async () => {
            setIsLoggingOut(true);
            await logoutAction();
            setIsLoggingOut(false);
          }}
          title="Logout"
          type="button"
        >
          <span className="material-symbols-outlined !text-[20px]">
            logout
          </span>
        </button>
      </div>
    </header>
  );
}
