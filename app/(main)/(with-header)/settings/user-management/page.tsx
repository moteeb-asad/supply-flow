import { getUsersAction } from "@/src/features/settings/users/actions/get-users.actions";
import UserManagementContent from "@/src/features/settings/users/components/UserManagementContent";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function UserManagementPage() {
  const { users } = await getUsersAction();

  return (
    <Suspense fallback={null}>
      <UserManagementContent users={users} />
    </Suspense>
  );
}
