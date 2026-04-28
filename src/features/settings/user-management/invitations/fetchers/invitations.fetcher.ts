"use client";

import { getInvitationsAction } from "../actions/get-invitations.actions";

export async function invitationsFetcher(params: {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, unknown>;
}) {
  const result = await getInvitationsAction(params);

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
