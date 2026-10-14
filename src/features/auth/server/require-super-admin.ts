import { createClient } from "@/src/db/supabaseClient";
import { hasPermission, isRole } from "@/src/features/auth/utils/rbac";

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

  // Checked against the database (not the token) before admin client access.
  const roleName = profile?.primary_role?.name;
  const role = isRole(roleName) ? roleName : null;

  if (profileError || !hasPermission(role, "users:manage")) {
    throw new Error("Unauthorized");
  }

  return user;
}
