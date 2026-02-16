"use client";

import { logoutAction } from "@/src/features/auth/actions/auth.actions";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { getPageTitle } from "@/src/lib/page-titles";
import DynamicHeader from "./DynamicHeader";
import { Button } from "../../ui/Button";

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-[#e7ebf3] bg-white shrink-0">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold tracking-tight">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Dynamic header content (search, action buttons) per route */}
        <DynamicHeader />

        <button className="p-2 text-[#4e6797] hover:bg-gray-100 rounded-lg relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white" />
        </button>

        <Button
          onClick={async () => {
            setIsLoggingOut(true);
            await logoutAction();
            setIsLoggingOut(false);
          }}
          disabled={isLoggingOut}
          title="Logout"
          variant="icon"
          shadow="none"
          className="p-2 text-[#4e6797] hover:bg-gray-100 rounded-lg disabled:opacity-50 inline-block cursor-pointer w-auto"
        >
          <span className="material-symbols-outlined">logout</span>
        </Button>
      </div>
    </header>
  );
}
