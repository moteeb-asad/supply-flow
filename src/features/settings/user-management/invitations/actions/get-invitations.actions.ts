"use server";

import { createAdminClient } from "@/src/db/supabaseAdmin";
import { mapInvitation } from "../mappers/invitation.mapper";
import { requireSuperAdmin } from "@/src/features/auth/server/require-super-admin";
import { buildInvitationsQuery } from "../lib/build-invitations-query";
import { Filters } from "../../users/types/filters";

export async function getInvitationsAction(params: Filters) {
  await requireSuperAdmin();
  const adminClient = createAdminClient();

  const { query, from, to } = buildInvitationsQuery(adminClient, params);
  const { data, count, error } = await query.range(from, to);

  if (error) {
    return { success: false, error: error.message, users: [], total: 0 };
  }
  if (!data) {
    return { success: true, users: [], total: 0 };
  }

  return {
    success: true,
    users: (data ?? []).map(mapInvitation),
    total: count ?? data.length,
  };
}
