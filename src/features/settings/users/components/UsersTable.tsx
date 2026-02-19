"use client";

import TableHeader from "@/src/features/settings/users/components/TableHeader";
import TablePagination from "@/src/features/settings/users/components/TablePagination";
import { UsersTableProps } from "../types/user.types";
import { formatDistanceToNow } from "date-fns";

export default function UsersTable({ users = [] }: UsersTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastLogin = (lastSignIn: string | null) => {
    if (!lastSignIn) return "Never";
    return formatDistanceToNow(new Date(lastSignIn), { addSuffix: true });
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden shadow-sm">
        <TableHeader />

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light/50">
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7ebf3]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-4xl text-[#4e6797]/40">
                      group_off
                    </span>
                    <p className="text-sm text-[#4e6797]">No users found</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
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
                          {getInitials(user.full_name)}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-[#0e121b]">
                        {user.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4e6797]">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase">
                      {user.primary_role_label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4e6797]">
                    {formatLastLogin(user.last_sign_in_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
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
                        <span className="material-symbols-outlined text-xl">
                          block
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <TablePagination
          currentPage={1}
          totalPages={Math.ceil(users.length / 10)}
          from={users.length > 0 ? 1 : 0}
          to={users.length}
          total={users.length}
          itemLabel="users"
        />
      </div>
    </div>
  );
}
