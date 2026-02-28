// users/lib/build-users-query.ts

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Filters } from "@/src/features/settings/user-management/users/types/filters";

export function buildUsersQuery(
  adminClient: SupabaseClient,
  { page = 1, itemsPerPage = 10, roleIds, search, lastLoginRange }: Filters,
) {
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let query = adminClient
    .from("profiles")
    .select(
      `
        id,
        full_name,
        email,
        avatar_url,
        last_login_at,
        created_at,
        primary_role_id,
        primary_role:roles!profiles_primary_role_id_fkey(id, name)
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  // role filter
  if (roleIds?.length) {
    query = query.in("primary_role_id", roleIds);
  }

  // search filter
  if (search?.trim()) {
    const value = `%${search.trim()}%`;
    query = query.or(`full_name.ilike.${value},email.ilike.${value}`);
  }

  // future date filters live here
  if (lastLoginRange) {
    // date logic later
  }

  return { query, from, to };
}
