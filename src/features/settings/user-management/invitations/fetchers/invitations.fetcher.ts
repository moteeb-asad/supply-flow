"use client";

import { getInvitationsAction } from "../actions/get-invitations.actions";

export async function invitationsFetcher(params: {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, unknown>;
}) {
  const result = await getInvitationsAction();
  return {
    data: Array.isArray(result) ? result : [],
    total: Array.isArray(result) ? result.length : 0,
  };
}
