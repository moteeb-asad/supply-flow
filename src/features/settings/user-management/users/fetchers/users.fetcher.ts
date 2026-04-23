"use client";

import { getUsersAction } from "../actions/get-users.actions";
import { Filters } from "../types/filters";

export async function usersFetcher(params: {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Filters;
}) {
  const { page, pageSize, search, filters } = params;
  const result = await getUsersAction({
    page,
    pageSize,
    search,
    filters: filters?.filters, // Only pass the nested UserFilters
  });

  if (result.success) {
    return {
      data: result.users,
      total: result.total,
    };
  }

  console.log("fetcher", result);
  return {
    data: [],
    total: 0,
  };
}
