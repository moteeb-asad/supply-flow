import UsersTable from "@/src/features/settings/users/components/UsersTable";
import { getUsersAction } from "@/src/features/settings/users/actions/get-users.actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const { users } = await getUsersAction();

  return <UsersTable users={users} />;
}
