import { Input } from "@/src/components/ui/Input";
import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";
import { formatRole } from "@/src/lib/utils";

export default async function ProfileCard() {
  const user = await getCurrentUser();

  // Extract name from user metadata
  const userName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  // Get first letter of name for avatar
  const initial = userName.charAt(0).toUpperCase();
  const readableRole = formatRole(user?.user_metadata?.role);
  return (
    <div className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[#e7ebf3] flex items-center justify-between">
        <h3 className="text-base font-bold">Profile Details</h3>
        <button className="text-primary text-sm font-bold hover:underline">
          Edit Profile
        </button>
      </div>
      <div className="p-6">
        <div className="flex items-start gap-8">
          <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{initial}</span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Full Name
              </label>
              <Input
                className="w-full bg-gray-50 border-none rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-primary/50 cursor-default"
                defaultValue={userName}
                readOnly
                type="text"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Job Role
              </label>
              <Input
                className="w-full bg-gray-50 border-none rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-primary/50 cursor-default"
                defaultValue={readableRole}
                readOnly
                type="text"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Input
                  className="w-full bg-gray-50 border-none rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-primary/50 cursor-default"
                  readOnly
                  type="email"
                  defaultValue={user?.email || ""}
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-success text-lg">
                  verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50/50 border-t border-[#e7ebf3] flex justify-end">
        <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
