"use client";

import DataTable from "@/src/components/data-table/core/DataTable";
import { invitationsTableConfig } from "../invitations.table.config";
import {
  Invitation,
  InvitationsFiltersValue,
  InvitationsTableQueryParams,
} from "@/src/features/settings/user-management/invitations/types";
import { useState } from "react";

export default function InvitationsTableView() {
  const [filters, setFilters] = useState<InvitationsFiltersValue>({});
  const handleFiltersChange = setFilters;
  return (
    <DataTable<Invitation, InvitationsTableQueryParams, InvitationsFiltersValue>
      key="invitations-table"
      config={invitationsTableConfig}
      filters={filters}
      onFiltersChange={handleFiltersChange}
    />
  );
}
