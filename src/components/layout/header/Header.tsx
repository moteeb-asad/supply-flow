"use client";

import { logoutAction } from "@/src/features/auth/actions/auth.actions";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import { getPageTitle } from "@/src/lib/page-titles";
import DynamicHeader from "./DynamicHeader";

function LogoutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="p-2 text-[#4e6797] hover:bg-gray-100 rounded-lg disabled:opacity-50"
      type="submit"
      disabled={pending}
      title="Logout"
    >
      <span className="material-symbols-outlined">logout</span>
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
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
        <button className="p-2 text-[#4e6797] hover:bg-gray-100 rounded-lg">
          <span className="material-symbols-outlined">help</span>
        </button>
        <form action={logoutAction}>
          <LogoutButton />
        </form>
      </div>
    </header>
  );
}
