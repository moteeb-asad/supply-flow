"use client";

import { getUsersAction } from "../actions/get-users.actions";

export async function usersFetcher(params: {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, unknown>;
}) {
  const result = await getUsersAction(params);

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
