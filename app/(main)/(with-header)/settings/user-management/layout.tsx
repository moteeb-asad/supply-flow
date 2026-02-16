"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const linkBase = "py-4 text-sm font-medium border-b-2 transition-colors";
  const linkActive = "text-primary border-primary";
  const linkInactive =
    "text-[#4e6797] hover:text-primary border-transparent hover:border-primary";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sub-navigation tabs */}
      <div className="border-b border-[#e7ebf3] bg-white px-8">
        <nav className="flex gap-6">
          <Link
            href="/settings/user-management"
            className={`${linkBase} ${pathname === "/settings/user-management" ? linkActive : linkInactive}`}
          >
            Users
          </Link>
          <Link
            href="/settings/user-management/invitations"
            className={`${linkBase} ${pathname === "/settings/user-management/invitations" ? linkActive : linkInactive}`}
          >
            Invitations
          </Link>
          <Link
            href="/settings/user-management/permissions"
            className={`${linkBase} ${pathname === "/settings/user-management/permissions" ? linkActive : linkInactive}`}
          >
            Permissions
          </Link>
        </nav>
      </div>

      {/* Page content */}
      {children}
    </div>
  );
}
