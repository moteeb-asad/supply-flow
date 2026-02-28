"use server";

import { createAdminClient } from "@/src/db/supabaseAdmin";
import { requireSuperAdmin } from "@/src/features/auth/server/require-super-admin";
import { buildUsersQuery } from "@/src/features/settings/user-management/users/lib/build-users-query";
import { fetchUserRoles } from "../lib/fetch-user-roles";
import { mapUserDTO } from "../lib/map-user.dto";
import type { Filters } from "@/src/features/settings/user-management/users/types/filters";
import type { Profile } from "../types/user.types";

export async function getUsersAction(params: Filters) {
  await requireSuperAdmin();

  const adminClient = createAdminClient();

  // buildUsersQuery returns { query, from, to }
  const { query, from, to } = buildUsersQuery(adminClient, params);

  const { data, count, error } = await query.range(from, to);
  if (error) {
    return { success: false, error: error.message, users: [], total: 0 };
  }
  if (!data) {
    return { success: true, users: [], total: 0 };
  }

  const rolesMap = await fetchUserRoles(adminClient, data);
  const users = (data as unknown[]).map((p) => {
    // Type guard for Profile
    const base = p as Partial<Profile>;
    let primary_role: { id: string; name: string } | null = null;
    if (Array.isArray(base.primary_role)) {
      primary_role = base.primary_role[0] ?? null;
    } else if (base.primary_role && typeof base.primary_role === "object") {
      primary_role = base.primary_role as { id: string; name: string };
    }
    return mapUserDTO({ ...base, primary_role } as Profile, rolesMap);
  });

  return { success: true, users, total: count ?? users.length };
}
