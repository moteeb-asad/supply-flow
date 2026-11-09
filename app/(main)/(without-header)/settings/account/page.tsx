import Link from "next/link";
import ProfileCard from "@/src/features/settings/account/components/ProfileCard";
import SecuritySection from "@/src/features/settings/account/components/SecuritySection";
import { createServerSupabaseClient } from "@/src/db/supabaseServer";
import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";
import AppIcon from "@/src/components/ui/AppIcon";

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
    <>
      <header className="px-8 pb-6 pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[13px]"
        >
          <Link href="/settings" className="text-muted hover:text-ink">
            Settings
          </Link>
          <AppIcon name="chevronRight" className="size-3.5 text-subtle" />
          <span aria-current="page" className="text-ink">
            Account
          </span>
        </nav>
        <h1 className="mt-4 text-2xl font-semibold tracking-[-0.01em]">
          Account
        </h1>
        <p className="mt-1 text-sm text-muted">
          How you appear to your team, and how you sign in.
        </p>
      </header>

      <div className="max-w-4xl space-y-6 px-8 pb-8">
        <ProfileCard />
        <SecuritySection passwordChangedAt={passwordChangedAt} />
      </div>
    </>
  );
}
