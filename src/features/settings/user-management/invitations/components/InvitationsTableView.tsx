import DataTable from "@/src/components/data-table/DataTable";
import { invitationsTableConfig } from "../invitations.table.config";
import { Invitation } from "@/src/features/settings/user-management/invitations/types";

export default function InvitationsTableView() {
  return (
    <DataTable<
      Invitation,
      {
        page: number;
        pageSize: number;
        search?: string;
        filters?: Record<string, unknown>;
      }
    >
      config={invitationsTableConfig}
    />
  );
}
