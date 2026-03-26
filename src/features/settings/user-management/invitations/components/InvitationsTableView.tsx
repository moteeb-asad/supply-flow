"use client";

import DataTable from "@/src/components/data-table/DataTable";
import { invitationsTableConfig } from "../invitations.table.config";
import { Invitation } from "@/src/features/settings/user-management/invitations/types";
import { useState } from "react";

export default function InvitationsTableView() {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
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
      key="invitations-table"
      config={invitationsTableConfig}
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
}
