import Link from "next/link";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sub-navigation tabs */}
      <div className="border-b border-[#e7ebf3] bg-white px-8">
        <nav className="flex gap-6">
          <Link
            href="/settings/users"
            className="py-4 text-sm font-medium text-[#4e6797] hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors"
          >
            All Users
          </Link>
          <Link
            href="/settings/users/invitations"
            className="py-4 text-sm font-medium text-[#4e6797] hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors"
          >
            Invitations
          </Link>
          <Link
            href="/settings/users/permissions"
            className="py-4 text-sm font-medium text-[#4e6797] hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors"
          >
            Permissions
          </Link>
          <Link
            href="/settings/users/security"
            className="py-4 text-sm font-medium text-[#4e6797] hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors"
          >
            Security
          </Link>
        </nav>
      </div>

      {/* Page content */}
      {children}
    </div>
  );
}
