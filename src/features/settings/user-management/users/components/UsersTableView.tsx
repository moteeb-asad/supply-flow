import DataTable from "@/src/components/data-table/DataTable";
import { usersTableConfig } from "../users.table.config";
import { User } from "../types/user.types";

export default function UsersTableView() {
  return <DataTable<User> config={usersTableConfig} />;
}
