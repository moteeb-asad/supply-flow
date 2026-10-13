import { createClient } from "@/src/db/supabaseClient";
import { hasPermission, toRoles } from "@/src/features/auth/utils/rbac";

export async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("primary_role:roles!profiles_primary_role_id_fkey(name)")
    .eq("id", user.id)
    .maybeSingle<{ primary_role: { name: string } | null }>();

  if (
    profileError ||
    !hasPermission(toRoles(profile?.primary_role?.name), "users:manage")
  ) {
    throw new Error("Unauthorized");
  }

  return user;
}
