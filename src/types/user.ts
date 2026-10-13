import type { Role } from "@/src/features/auth/types";

export type UserProfile = {
  id: string;
  email: string;
  fullName?: string;
  primaryRole?: Role;
};

export type UserContextValue = {
  user: UserProfile | null;
  loading: boolean;
};

export type ProfileRoleRow = {
  full_name: string | null;
  primary_role_id: string | null;
};

export type RoleNameRow = {
  name: string;
};
