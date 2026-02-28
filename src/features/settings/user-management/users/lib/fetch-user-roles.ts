// users/lib/fetch-user-roles.ts

import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRoleRow } from "../types/user.types";

/**
 * Fetches all roles for a list of user profiles and returns a Map of user_id to array of role names.
 * @param adminClient Supabase admin client
 * @param profiles Array of user profiles (must have id)
 */
export async function fetchUserRoles(
  adminClient: SupabaseClient,
  profiles: { id: string }[],
): Promise<Map<string, string[]>> {
  if (!profiles?.length) return new Map();
  const userIds = profiles.map((p) => p.id);
  const { data, error } = await adminClient
    .from("user_roles")
    .select("user_id, role:roles!user_roles_role_id_fkey(id, name)")
    .in("user_id", userIds);

  if (error) throw error;

  // Map user_id to array of role names
  const map = new Map<string, string[]>();
  (data as UserRoleRow[] | undefined)?.forEach((ur) => {
    if (!map.has(ur.user_id)) map.set(ur.user_id, []);
    if (Array.isArray(ur.role)) {
      ur.role.forEach((roleObj) => {
        if (roleObj?.name) map.get(ur.user_id)?.push(roleObj.name);
      });
    } else if (ur.role && "name" in ur.role) {
      map.get(ur.user_id)?.push(ur.role.name);
    }
  });
  return map;
}
