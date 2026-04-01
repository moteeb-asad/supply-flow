"use client";

import { usersColumns } from "./components/UsersColumns";
import { UsersFilters } from "./components/UsersFilters";
import { usersFetcher } from "./fetchers/users.fetcher";
import type { UsersTableQueryParams } from "./types";

export const usersTableConfig = {
  fetcher: usersFetcher,
  columns: usersColumns,
  filters: UsersFilters,
  queryKey: (params: UsersTableQueryParams) => ["users-table", params],
};
