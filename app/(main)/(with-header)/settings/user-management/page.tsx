"use client";

import { Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import UsersTable from "@/src/features/settings/users/components/UsersTable";
import InviteUserModal from "@/src/features/settings/users/components/InviteUserModal";

function UserManagementContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInviteModalOpen = searchParams.get("modal") === "invite-user";

  const handleCloseModal = () => {
    router.push(pathname); // Remove query params
  };

  return (
    <>
      <UsersTable />
      <InviteUserModal isOpen={isInviteModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default function UserManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserManagementContent />
    </Suspense>
  );
}
