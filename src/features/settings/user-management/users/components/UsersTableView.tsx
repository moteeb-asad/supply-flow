"use client";

import DataTable from "@/src/components/data-table/DataTable";
import { usersTableConfig } from "../users.table.config";
import { User } from "../types/user.types";
import { useState } from "react";

export default function UsersTableView() {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  return (
    <DataTable<User>
      key="users-table"
      config={usersTableConfig}
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
}
