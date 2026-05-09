"use client";

import DataTable from "@/src/components/data-table/core/DataTable";
import { usersTableConfig } from "../users.table.config";
import { User } from "../types/user.types";
import { useState } from "react";
import { UsersFiltersValue, UsersTableQueryParams } from "../types/filters";

export default function UsersTableView() {
  const [filters, setFilters] = useState<UsersFiltersValue>({});
  const handleFiltersChange = setFilters;
  return (
    <DataTable<User, UsersTableQueryParams, UsersFiltersValue>
      key="users-table"
      config={usersTableConfig}
      filters={filters}
      onFiltersChange={handleFiltersChange}
    />
  );
}
