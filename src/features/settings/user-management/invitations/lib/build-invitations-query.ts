import { SupabaseClient } from "@supabase/supabase-js";
import { Filters } from "../../users/types/filters";

export function buildInvitationsQuery(
  adminClient: SupabaseClient,
  { page = 1, pageSize = 10, search, filters }: Filters,
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = adminClient
    .from("invitations")
    .select(
      `
        id,
        email,
        role_id,
        invited_by,
        sent_at,
        expires_at,
        status,
        accepted_by,
        accepted_at,
        role:role_id (
          id,
          name
        ),
        inviter_profile:invited_by (
          id,
          full_name,
          primary_role:primary_role_id (
            id,
            name
          )
        )
      `,
      { count: "exact" },
    )
    .order("sent_at", { ascending: false });

  if (search?.trim()) {
    const value = `%${search.trim()}%`;
    query = query.ilike("email", value);
  }

  if (
    filters?.roleIds &&
    Array.isArray(filters.roleIds) &&
    filters.roleIds.length > 0
  ) {
    const numericRoleIds = filters.roleIds.map((id) => Number(id));
    query = query.in("role_id", numericRoleIds);
  }

  return { query, from, to };
}
