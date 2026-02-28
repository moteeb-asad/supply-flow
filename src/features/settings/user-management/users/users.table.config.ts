"use client";

import { usersColumns } from "./components/UsersColumns";
import { UsersFilters } from "./components/UsersFilters";
import { usersFetcher } from "./fetchers/users.fetcher";

export const usersTableConfig = {
  fetcher: usersFetcher,
  columns: usersColumns,
  filters: UsersFilters,
};
