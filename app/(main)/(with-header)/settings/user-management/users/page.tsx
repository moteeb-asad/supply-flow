import UserManagementContainer from "@/src/features/settings/users/components/UserManagementContainer";
import { getUsersAction } from "@/src/features/settings/users/actions/get-users.actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const { users, total = 0 } = await getUsersAction({
    page: 1,
    itemsPerPage: 10,
  });

  return <UserManagementContainer initialUsers={users} initialTotal={total} />;
}
