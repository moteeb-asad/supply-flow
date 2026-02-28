// users/lib/map-user.dto.ts

import type { UserRole } from "@/src/features/auth/types";
import type { Profile, RoleMap } from "../types/user.types";

export function mapUserDTO(profile: Profile, userRolesMap: RoleMap) {
  const primaryRole = profile.primary_role;

  return {
    id: profile.id,
    full_name: profile.full_name,
    email: profile.email,
    avatar_url: profile.avatar_url,
    last_sign_in_at: profile.last_login_at,
    created_at: profile.created_at,
    primary_role_id: profile.primary_role_id,
    primary_role_label: (primaryRole?.name as UserRole) ?? null,
    roles: userRolesMap.get(profile.id) || [],
  };
}
