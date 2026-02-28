import { createClient } from "@/src/db/supabaseClient";

export async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.primary_role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  return user;
}
