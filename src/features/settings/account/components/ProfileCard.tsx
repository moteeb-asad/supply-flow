import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";
import { formatRole, getInitials } from "@/src/lib/utils";
import { getRoleFromAppMetadata } from "@/src/features/auth/utils/rbac";
import AppIcon from "@/src/components/ui/AppIcon";

const labelClassName = "text-[13px] font-medium";
const readOnlyFieldClassName =
  "h-10 w-full cursor-default rounded-control border border-line-soft bg-background-light px-3 text-sm text-muted focus:outline-none";

export default async function ProfileCard() {
  const user = await getCurrentUser();

  // Extract name from user metadata
  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const readableRole = formatRole(getRoleFromAppMetadata(user?.app_metadata));

  return (
    <section
      aria-labelledby="account-profile-title"
      className="rounded-card border border-line"
    >
      <div className="grid gap-6 p-6 md:grid-cols-[14rem_minmax(0,1fr)]">
        <div>
          <h2 id="account-profile-title" className="text-[15px] font-semibold">
            Profile
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Your name and role are set by a super admin.
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-neutral-soft text-lg font-semibold"
            >
              {getInitials(userName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="text-[13px] text-subtle">{readableRole}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="account-full-name" className={labelClassName}>
                Full name
              </label>
              <input
                id="account-full-name"
                className={`mt-1.5 ${readOnlyFieldClassName}`}
                defaultValue={userName}
                readOnly
                type="text"
              />
            </div>
            <div>
              <label htmlFor="account-role" className={labelClassName}>
                Job role
              </label>
              <input
                id="account-role"
                className={`mt-1.5 ${readOnlyFieldClassName}`}
                defaultValue={readableRole}
                readOnly
                type="text"
              />
            </div>
          </div>

          <div>
            <label htmlFor="account-email" className={labelClassName}>
              Email address
            </label>
            <div className="relative mt-1.5">
              <input
                id="account-email"
                className={`${readOnlyFieldClassName} pr-28`}
                defaultValue={user?.email || ""}
                readOnly
                type="email"
              />
              <span className="absolute right-2 top-1/2 inline-flex h-[22px] -translate-y-1/2 items-center gap-1 rounded-full bg-success-soft px-2 text-xs font-medium text-success">
                <AppIcon name="check" className="size-3" />
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
