"use client";

import DataTable from "@/src/components/data-table/core/DataTable";
import { invitationsTableConfig } from "../invitations.table.config";
import {
  Invitation,
  InvitationsFilters,
  InvitationsFiltersValue,
} from "@/src/features/settings/user-management/invitations/types";
import { useState } from "react";
import { set } from "zod";

export default function InvitationsTableView() {
  const [filters, setFilters] = useState<InvitationsFiltersValue>({});
  const handleFiltersChange = (filterValues: InvitationsFiltersValue) => {
    setFilters(filterValues);
  };
  return (
    <DataTable<
      Invitation,
      {
        page: number;
        pageSize: number;
        search?: string;
        filters?: InvitationsFiltersValue;
      }
    >
      key="invitations-table"
      config={invitationsTableConfig}
      filters={filters}
      onFiltersChange={handleFiltersChange}
    />
  );
}
