import { cache } from "react";
import { createServerSupabaseClient } from "@/src/db/supabaseServer";
import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";

// Display name for the signed-in user. profiles.full_name is the source of
// truth (what admins edit); the auth user_metadata copy is only a fallback,
// since it is empty for users created in the Supabase dashboard. cache() lets
// the sidebar and the account page share one query per request.
export const getCurrentUserName = cache(
  async function getCurrentUserName(): Promise<string> {
    const user = await getCurrentUser();
    if (!user) return "User";

    const supabase = await createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle<{ full_name: string | null }>();

    const metadataName = user.user_metadata?.full_name;

    return (
      profile?.full_name?.trim() ||
      (typeof metadataName === "string" ? metadataName.trim() : "") ||
      user.email?.split("@")[0] ||
      "User"
    );
  },
);
