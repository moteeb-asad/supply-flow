import TableHeader from "@/src/features/settings/user-management/shared/components/TableHeader";
import TablePagination from "@/src/features/settings/user-management/shared/components/TablePagination";
import { getInvitationsAction } from "@/src/features/settings/user-management/invitations/actions/get-invitations.actions";
import { formatRole, formatDate } from "@/src/lib/utils";
import { Invitation } from "../types";
import { JSX } from "react";

export default async function InvitationsTable(): Promise<JSX.Element> {
  const invitations: Invitation[] = await getInvitationsAction();

  console.log("Invitations in InvitationsTable:", invitations);
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden shadow-sm">
        <TableHeader />
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light/50">
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Role Assigned
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Invited By
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Sent Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Expiry
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7ebf3]">
            {invitations.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-[#4e6797]"
                >
                  No invitations found
                </td>
              </tr>
            ) : (
              invitations.map((invite) => (
                <tr
                  key={invite.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[#0e121b]">
                    {invite.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase">
                      {formatRole(invite.role?.name || "Unknown Role")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#4e6797]">
                      {invite.inviter_profile?.full_name || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4e6797]">
                    {invite.sent_at ? formatDate(invite.sent_at) : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4e6797]">
                    {invite.expires_at ? formatDate(invite.expires_at) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${invite.status === "pending" ? "bg-blue-50 text-blue-600" : invite.status === "expired" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                    >
                      {invite.status.charAt(0).toUpperCase() +
                        invite.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 rounded transition-colors">
                        Resend
                      </button>
                      <button
                        className="p-1.5 hover:bg-red-50 rounded-lg text-[#4e6797] hover:text-danger transition-colors"
                        title="Revoke Invitation"
                      >
                        <span className="material-symbols-outlined text-xl">
                          cancel
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
          total={invitations.length}
          itemsPerPage={10}
          itemLabel="invitations"
        />
      </div>
    </div>
  );
}
