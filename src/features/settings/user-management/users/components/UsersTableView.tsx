"use client";

import DataTable from "@/src/components/data-table/DataTable";
import { usersTableConfig } from "../users.table.config";
import { User } from "../types/user.types";
import { useState } from "react";
import { Filters } from "../types/filters";

export default function UsersTableView() {
  const [filters, setFilters] = useState<Filters>({});
  return (
    <DataTable<
      User,
      {
        page: number;
        pageSize: number;
        search?: string;
        filters?: Filters;
      }
    >
      key="users-table"
      config={usersTableConfig}
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
}
