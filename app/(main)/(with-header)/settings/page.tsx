import Link from "next/link";
import { createClient } from "@/src/db/supabaseClient";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user role from user metadata
  const userRole = user.user_metadata?.role as string | undefined;
  const isSuperAdmin = userRole === "super_admin";

  // Determine grid layout based on visible cards
  const gridCols = isSuperAdmin ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">
              General Configuration
            </h3>
            <p className="text-sm text-[#4e6797]">
              Manage your organization and personal account preferences.
            </p>
          </div>
          <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
            {isSuperAdmin && (
              <div className="bg-white p-6 rounded-xl border border-[#e7ebf3] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      group
                    </span>
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-2">User Management</h4>
                <p className="text-sm text-[#4e6797] mb-6 leading-relaxed">
                  Manage staff, roles, invitations, and permissions. Control
                  access levels for your warehouse and management team.
                </p>
                <Link
                  href="/settings/user-management"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <span>Configure</span>
                  <span className="material-symbols-outlined text-lg">
                    chevron_right
                  </span>
                </Link>
              </div>
            )}
            <div className="bg-white p-6 rounded-xl border border-[#e7ebf3] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    person
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-bold mb-2">Account Information</h4>
              <p className="text-sm text-[#4e6797] mb-6 leading-relaxed">
                Manage your personal profile, email, and security settings.
                Update your contact details and security preferences.
              </p>
              <Link
                href="/settings/account"
                className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors"
              >
                <span>Manage</span>
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#e7ebf3] shadow-sm hover:shadow-md transition-shadow opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="size-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined text-2xl">
                    notifications_active
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-bold mb-2">Notifications</h4>
              <p className="text-sm text-[#4e6797] mb-6 leading-relaxed">
                Configure how you receive alerts for inventory levels, order
                updates, and system reports.
              </p>
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 border border-[#e7ebf3] text-[#4e6797] px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors cursor-not-allowed"
              >
                <span>Coming Soon</span>
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#e7ebf3] shadow-sm hover:shadow-md transition-shadow opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="size-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined text-2xl">
                    database
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-bold mb-2">Data &amp; Export</h4>
              <p className="text-sm text-[#4e6797] mb-6 leading-relaxed">
                Manage data retention, backup schedules, and bulk export tools
                for your records and audits.
              </p>
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 border border-[#e7ebf3] text-[#4e6797] px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors cursor-not-allowed"
              >
                <span>Coming Soon</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
