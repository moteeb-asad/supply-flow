"use server";

import { createAdminClient } from "@/src/db/supabaseAdmin";
import { requireSuperAdmin } from "@/src/features/auth/server/require-super-admin";
import { buildUsersQuery } from "@/src/features/settings/user-management/users/lib/build-users-query";
import type { Filters } from "@/src/features/settings/user-management/users/types/filters";
import { mapUser } from "../mappers/user.mapper";

export async function getUsersAction(params: Filters) {
  await requireSuperAdmin();

  const adminClient = createAdminClient();
  const { query, from, to } = buildUsersQuery(adminClient, params);

  const { data, count, error } = await query.range(from, to);
  if (error) {
    return { success: false, error: error.message, users: [], total: 0 };
  }
  if (!data) {
    return { success: true, users: [], total: 0 };
  }

  return {
    success: true,
    users: (data ?? []).map(mapUser),
    total: count ?? data.length,
  };
}
