// users/lib/resolve-role-ids.ts

import type { SupabaseClient } from "@supabase/supabase-js";

let cachedRoleMap: Record<string, string> | null = null;

export async function resolveRoleIds(
  adminClient: SupabaseClient,
  roleNames?: string[],
) {
  if (!roleNames?.length) return [];

  // simple memory cache
  if (!cachedRoleMap) {
    const { data, error } = await adminClient.from("roles").select("id, name");

    if (error) throw error;

    cachedRoleMap = Object.fromEntries(data.map((r) => [r.name, r.id]));
  }

  return roleNames.map((name) => cachedRoleMap?.[name]).filter(Boolean);
}
