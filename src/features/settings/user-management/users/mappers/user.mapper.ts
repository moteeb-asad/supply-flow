import type { User } from "../types/user.types";
import { isRole } from "@/src/features/auth/utils/rbac";

export function mapUser(row: Record<string, unknown>): User {
  const primaryRoleName = (row["primary_role"] as { name: string } | null)
    ?.name;

  return {
    id: row["id"] as string,
    full_name: row["full_name"] as string,
    avatar_url: row["avatar_url"] as string | null,
    created_at: row["created_at"] as string,
    email: row["email"] as string,
    last_login_at: row["last_login_at"] as string | null,
    primary_role_label: isRole(primaryRoleName) ? primaryRoleName : null,
    roles: Array.isArray(row["roles"]) ? (row["roles"] as string[]) : [],
  };
}
