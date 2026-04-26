import type { SupabaseClient } from "@supabase/supabase-js";
import type { Filters } from "@/src/features/settings/user-management/users/types/filters";
import { FilterPeriod, getFilterDate } from "@/src//lib/date-range-utils";

export function buildUsersQuery(
  adminClient: SupabaseClient,
  { page = 1, pageSize = 10, search, filters }: Filters,
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

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

  // Search filter
  if (search?.trim()) {
    const value = `%${search.trim()}%`;
    query = query.or(`full_name.ilike.${value},email.ilike.${value}`);
  }

  // Role filter
  if (
    filters?.roleIds &&
    Array.isArray(filters.roleIds) &&
    filters.roleIds.length > 0
  ) {
    const numericRoleIds = filters.roleIds.map((id) => Number(id));
    query = query.in("primary_role_id", numericRoleIds);
  }

  // Last login filter
  const lastLoginDate = getFilterDate(
    filters?.lastLogin as FilterPeriod | undefined,
  );
  if (lastLoginDate) {
    query = query.gte("last_login_at", lastLoginDate);
  }

  return { query, from, to };
}
