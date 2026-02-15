import UsersTable from "@/src/features/settings/users/components/UsersTable";
import InviteUserModal from "@/src/features/settings/users/components/InviteUserModal";

export default function UserManagementPage() {
  return (
    <>
      <UsersTable />
      <InviteUserModal />
    </>
  );
}
