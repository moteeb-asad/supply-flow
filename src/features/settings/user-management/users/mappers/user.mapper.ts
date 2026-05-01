import type { User, UserRole } from "../types/user.types";

export function mapUser(row: Record<string, unknown>): User {
  return {
    id: row["id"] as string,
    full_name: row["full_name"] as string,
    avatar_url: row["avatar_url"] as string | null,
    created_at: row["created_at"] as string,
    email: row["email"] as string,
    last_login_at: row["last_login_at"] as string | null,
    primary_role_label:
      ((row["primary_role"] as { name: string } | null)
        ?.name as UserRole | null) ?? null,
    roles: Array.isArray(row["roles"]) ? (row["roles"] as string[]) : [],
  };
}
