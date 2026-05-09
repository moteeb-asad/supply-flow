"use client";

import type { DataTableConfig } from "@/src/components/data-table/types";
import {
  parseIdsFromLabelParam,
  serializeLabelParamFromIds,
  setOrDeleteParam,
} from "@/src/lib/url-filter-utils";
import { ROLES } from "@/src/constants/roles";
import { usersColumns } from "./components/UsersColumns";
import { UsersFilters } from "./components/UsersFilters";
import { usersFetcher } from "./fetchers/users.fetcher";
import type { User } from "./types/user.types";
import type { UsersFiltersValue, UsersTableQueryParams } from "./types/filters";
import { isFilterPeriod } from "@/src/lib/date-range-utils";

const parseUsersFiltersFromUrl = (
  searchParams: URLSearchParams,
): UsersFiltersValue => {
  const lastLoginParam = searchParams.get("lastLogin");
  const roleParam = searchParams.get("role");

  return {
    roleIds: parseIdsFromLabelParam(roleParam, ROLES),
    lastLogin: isFilterPeriod(lastLoginParam) ? lastLoginParam : undefined,
  };
};

export const usersTableConfig: DataTableConfig<
  User,
  UsersTableQueryParams,
  UsersFiltersValue
> = {
  fetcher: usersFetcher,
  columns: usersColumns,
  filters: UsersFilters,
  searchPlaceholder: "Search users...",
  queryKey: (params: UsersTableQueryParams) => ["users-table", params],

  parseFiltersFromUrl: parseUsersFiltersFromUrl,
  writeFiltersToUrl: (filters, params) => {
    setOrDeleteParam(
      params,
      "role",
      serializeLabelParamFromIds(filters.roleIds, ROLES),
    );
    setOrDeleteParam(params, "lastLogin", filters.lastLogin);
  },
};
