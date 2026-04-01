import { DataTableColumn } from "@/src/components/data-table/types";
import type { User } from "../types/user.types";
import { formatRole, getInitials, formatLastLogin } from "@/src/lib/utils";

export const usersColumns: DataTableColumn<User>[] = [
  {
    key: "name",
    header: "Name",
    cell: (user) => (
      <div className="flex items-center gap-3">
        {user.avatar_url ? (
          <div
            className="size-9 rounded-full bg-cover bg-center border border-gray-200"
            style={{
              backgroundImage: `url("${user.avatar_url}")`,
            }}
          ></div>
        ) : (
          <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
            {getInitials(user?.full_name)}
          </div>
        )}
        <span className="text-sm font-semibold text-[#0e121b]">
          {user?.full_name}
        </span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    cell: (user) => (
      <span className="text-sm text-[#4e6797]">{user.email}</span>
    ),
  },
  {
    key: "role",
    header: "Role",
    cell: (user) => (
      <span
        className={
          formatRole(user.primary_role_label) === "Admin"
            ? "px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase text-nowrap"
            : formatRole(user.primary_role_label) === "Operations Manager"
              ? "px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-600 uppercase text-nowrap"
              : "px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-[#4e6797] uppercase text-nowrap"
        }
      >
        {formatRole(user.primary_role_label)}
      </span>
    ),
  },
  {
    key: "last_login",
    header: "Last Login",
    cell: (user) => (
      <span className="text-sm text-[#4e6797]">
        {formatLastLogin(user.last_sign_in_at)}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    cell: (user) => (
      <div className="flex justify-end gap-2">
        <button
          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#4e6797] hover:text-primary transition-colors"
          title="Edit Role"
        >
          <span className="material-symbols-outlined text-xl">
            manage_accounts
          </span>
        </button>
        <button
          className="p-1.5 hover:bg-red-50 rounded-lg text-[#4e6797] hover:text-danger transition-colors"
          title="Disable User"
        >
          <span className="material-symbols-outlined text-xl">block</span>
        </button>
      </div>
    ),
  },
];
