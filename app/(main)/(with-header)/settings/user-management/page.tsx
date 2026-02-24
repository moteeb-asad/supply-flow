import { getUsersAction } from "@/src/features/settings/user-management/users/actions/get-users.actions";
import UserManagementContent from "@/src/features/settings/user-management/users/components/UserManagementContent";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function UserManagementPage() {
  const { users, total = 0 } = await getUsersAction({
    page: 1,
    itemsPerPage: 10,
  });

  return (
    <Suspense fallback={null}>
      <UserManagementContent users={users} total={total} />
    </Suspense>
  );
}
