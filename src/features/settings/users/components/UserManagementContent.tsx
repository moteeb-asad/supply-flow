"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import UsersTable from "@/src/features/settings/users/components/UsersTable";
import InviteUserModal from "@/src/features/settings/users/components/InviteUserModal";
import { User } from "../types/user.types";

interface UserManagementContentProps {
  users: User[];
}

export default function UserManagementContent({
  users,
}: UserManagementContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInviteModalOpen = searchParams.get("modal") === "invite-user";

  const handleCloseModal = () => {
    router.push(pathname); // Remove query params
  };

  return (
    <>
      <UsersTable users={users} />
      <InviteUserModal isOpen={isInviteModalOpen} onClose={handleCloseModal} />
    </>
  );
}
