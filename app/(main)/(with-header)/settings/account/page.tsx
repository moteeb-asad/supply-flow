import ProfileCard from "@/src/features/settings/account/components/ProfileCard";
import SecuritySection from "@/src/features/settings/account/components/SecuritySection";
import { createServerSupabaseClient } from "@/src/db/supabaseServer";
import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();

  let passwordChangedAt: string | null = null;

  if (user) {
    const supabase = await createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("password_changed_at")
      .eq("id", user.id)
      .single();

    passwordChangedAt = profile?.password_changed_at ?? null;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* <ProfileCard /> */}
        <ProfileCard />
        {/* <SecuritySection /> */}
        <SecuritySection passwordChangedAt={passwordChangedAt} />
      </div>
    </div>
  );
}
