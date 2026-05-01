"use client";

import { getUsersAction } from "../actions/get-users.actions";
import { UserFiltersValue } from "../types/filters";

export async function usersFetcher(params: {
  page: number;
  pageSize: number;
  search?: string;
  filters?: UserFiltersValue;
}) {
  const { page, pageSize, search, filters } = params;
  const result = await getUsersAction({
    page,
    pageSize,
    search,
    filters,
  });

  if (result.success) {
    return {
      data: result.users,
      total: result.total,
    };
  }

  return {
    data: [],
    total: 0,
  };
}
