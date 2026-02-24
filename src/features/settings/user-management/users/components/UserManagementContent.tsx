"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import UserManagementContainer from "../../UserManagementContainer";
import { User } from "../types/user.types";
import InviteUserModal from "../../shared/components/InviteUserModal";

interface UserManagementContentProps {
  users: User[];
  total: number;
}

export default function UserManagementContent({
  users,
  total,
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
      <UserManagementContainer initialUsers={users} initialTotal={total} />
      <InviteUserModal isOpen={isInviteModalOpen} onClose={handleCloseModal} />
    </>
  );
}
