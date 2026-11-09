import { DataTableColumn } from "@/src/components/data-table/types";
import type { User } from "../types/user.types";
import { formatRole, getInitials } from "@/src/lib/utils";
import { formatRelative } from "@/src/lib/dates";
import { getRoleBadgeClassName } from "../../shared/constants/role-badge";

const actionButtonClassName =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-control text-subtle";

export const usersColumns: DataTableColumn<User>[] = [
  {
    key: "name",
    header: "Name",
    cell: (user) => (
      <div className="flex items-center gap-3">
        {user.avatar_url ? (
          <div
            aria-hidden="true"
            className="size-8 shrink-0 rounded-full border border-line bg-cover bg-center"
            style={{
              backgroundImage: `url("${user.avatar_url}")`,
            }}
          ></div>
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-soft text-xs font-semibold"
          >
            {getInitials(user?.full_name)}
          </span>
        )}
        <span className="font-medium">{user?.full_name}</span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    className: "text-muted",
    cell: (user) => user.email,
  },
  {
    key: "role",
    header: "Role",
    cell: (user) => (
      <span className={getRoleBadgeClassName(user.primary_role_label)}>
        {formatRole(user.primary_role_label)}
      </span>
    ),
  },
  {
    key: "last_login",
    header: "Last Login",
    className: "whitespace-nowrap",
    cell: (user) => (
      <span className={user.last_login_at ? "text-muted" : "text-subtle"}>
        {formatRelative(user.last_login_at, "Never")}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "text-right",
    className: "text-right",
    cell: (user) => (
      <div className="flex justify-end gap-1">
        <button
          type="button"
          className={`${actionButtonClassName} hover:bg-background-light hover:text-ink`}
          title="Edit Role"
          aria-label={`Edit role for ${user.full_name}`}
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined !text-[18px]"
          >
            manage_accounts
          </span>
        </button>
        <button
          type="button"
          className={`${actionButtonClassName} hover:bg-danger-soft hover:text-danger`}
          title="Disable User"
          aria-label={`Disable ${user.full_name}`}
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined !text-[18px]"
          >
            block
          </span>
        </button>
      </div>
    ),
  },
];
