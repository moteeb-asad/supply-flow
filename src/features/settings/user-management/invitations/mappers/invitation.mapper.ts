import type { Invitation } from "../types";
export function mapInvitation(row: Record<string, unknown>): Invitation {
  type RoleObj = { id: string; name: string };
  type InviterProfileObj = {
    id: string;
    full_name: string;
    primary_role?: RoleObj;
  };

  const inviterProfileRaw = Array.isArray(row["inviter_profile"])
    ? (row["inviter_profile"] as InviterProfileObj[])[0]
    : (row["inviter_profile"] as InviterProfileObj | undefined);

  const primaryRoleRaw =
    inviterProfileRaw?.primary_role &&
    Array.isArray(inviterProfileRaw.primary_role)
      ? (inviterProfileRaw.primary_role as RoleObj[])[0]
      : inviterProfileRaw?.primary_role;

  return {
    id: row["id"] as string,
    email: row["email"] as string,
    invited_by: row["invited_by"] as string,
    sent_at: row["sent_at"] as string,
    expires_at: row["expires_at"] as string,
    status: row["status"] as string,
    role: Array.isArray(row["role"])
      ? (row["role"] as RoleObj[])[0]
      : (row["role"] as RoleObj | undefined),
    inviter_profile: inviterProfileRaw
      ? {
          id: inviterProfileRaw.id,
          full_name: inviterProfileRaw.full_name,
          primary_role: primaryRoleRaw ?? undefined,
        }
      : undefined,
  };
}
