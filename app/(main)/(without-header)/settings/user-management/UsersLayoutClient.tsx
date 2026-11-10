"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import InviteUserModal from "@/src/features/settings/user-management/shared/components/InviteUserModal";
import AppIcon from "@/src/components/ui/AppIcon";
import { Button } from "@/src/components/ui/Button";
import { useUser } from "@/src/providers/UserProvider";
import {
  DEMO_ACCOUNT_DISABLED_MESSAGE,
  isDemoAccount,
} from "@/src/features/auth/utils/demo-account";

export default function UsersLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isInviteModalOpen = searchParams.get("modal") === "invite-user";
  const { user } = useUser();
  const isDemo = isDemoAccount(user?.email);

  const handleCloseModal = () => {
    router.push(pathname);
  };

  return (
    <>
      <header className="px-8 pb-6 pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[13px]"
        >
          <Link href="/settings" className="text-muted hover:text-ink">
            Settings
          </Link>
          <AppIcon name="chevronRight" className="size-3.5 text-subtle" />
          <span aria-current="page" className="text-ink">
            User management
          </span>
        </nav>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-[-0.01em]">
              User management
            </h1>
            <p className="mt-1 text-sm text-muted">
              Who can sign in, and what each role can do.
            </p>
          </div>
          {/* Opens the modal through the URL, as the old header action did. */}
          <Button
            size="md"
            disabled={isDemo}
            title={isDemo ? DEMO_ACCOUNT_DISABLED_MESSAGE : undefined}
            onClick={() => router.push(`${pathname}?modal=invite-user`)}
          >
            <AppIcon name="userPlus" className="size-4" />
            Invite user
          </Button>
        </div>
      </header>

      {/* Each page's table card carries the Users / Invitations tabs. */}
      <div className="px-8 pb-8">{children}</div>

      <InviteUserModal isOpen={isInviteModalOpen} onClose={handleCloseModal} />
    </>
  );
}
