import type { UserRole } from "@/src/features/auth/types";

export interface User {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  email: string;
  last_sign_in_at: string | null;
  primary_role_label: UserRole | null;
  roles: string[];
}

export type UserRoleRow = {
  user_id: string;
  role: { id: string; name: string } | { id: string; name: string }[] | null;
};

export type RoleMap = Map<string, string[]>;

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  last_login_at: string;
  created_at: string;
  primary_role_id: string;
  primary_role: { id: string; name: string } | null;
};
