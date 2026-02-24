"use server";

import { createAdminClient } from "@/src/db/supabaseAdmin";
import { mapInvitation } from "../mappers/invitation.mapper";

export async function getInvitationsAction() {
  const adminClient = createAdminClient();
  // Try simple select first
  const { data, error } = await adminClient
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
    )
    .order("sent_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch invitations:", error);
    return [];
  }

  // Optionally fetch role name and inviter info
  // You can do a second query or add joins if foreign keys are set up

  return (data ?? []).map(mapInvitation);
}
