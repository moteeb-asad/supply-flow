"use client";

import { usersColumns } from "./components/UsersColumns";
import { UsersFilters } from "./components/UsersFilters";
import { usersFetcher } from "./fetchers/users.fetcher";
import type { UsersTableQueryParams } from "./types/filters";

export const usersTableConfig = {
  fetcher: usersFetcher,
  columns: usersColumns,
  filters: UsersFilters,
  searchPlaceholder: "Search users...",
  queryKey: (params: UsersTableQueryParams) => ["users-table", params],
};
