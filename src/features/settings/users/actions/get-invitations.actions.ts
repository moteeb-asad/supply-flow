"use server";

import { createAdminClient } from "@/src/db/supabaseAdmin";

export async function getInvitationsAction() {
  const adminClient = createAdminClient();
  // Try simple select first
  const { data, error } = await adminClient
    .from("invitations")
    .select(
      "id, email, role_id, invited_by, sent_at, expires_at, status, accepted_by, accepted_at",
    )
    .order("sent_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch invitations:", error);
    return [];
  }

  // Optionally fetch role name and inviter info
  // You can do a second query or add joins if foreign keys are set up

  return data || [];
}
