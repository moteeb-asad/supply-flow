import { DataTableColumn } from "@/src/components/data-table/types";
import {
  formatRole,
  getInitials,
  formatLastLogin,
  formatDate,
} from "@/src/lib/utils";
import { Invitation } from "../types";

export const invitationsColumns: DataTableColumn<Invitation>[] = [
  {
    key: "email",
    header: "Email",
    cell: (invite) => (
      <span className="text-sm font-medium text-[#0e121b]">{invite.email}</span>
    ),
  },
  {
    key: "role",
    header: "Role Assigned",
    cell: (invite) => (
      <span
        className={
          formatRole(invite.role?.name) === "Admin"
            ? "px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase"
            : formatRole(invite.role?.name) === "Operations Manager"
              ? "px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-600 uppercase"
              : "px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-[#4e6797] uppercase"
        }
      >
        {formatRole(invite.role?.name) ?? "—"}
      </span>
    ),
  },
  {
    key: "invited_by",
    header: "Invited By",
    cell: (invite) => (
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#4e6797]">
          {invite.inviter_profile?.full_name ?? "—"}
        </span>
      </div>
    ),
  },
  {
    key: "sent_at",
    header: "Sent Date",
    cell: (invite) => (
      <span className="text-sm text-[#4e6797]">
        {invite.sent_at ? formatDate(invite.sent_at) : "-"}
      </span>
    ),
  },
  {
    key: "expiry",
    header: "Expiry",
    cell: (invite) => (
      <span
        className={
          invite.status === "Expired"
            ? "text-sm text-danger font-medium"
            : "text-sm text-[#4e6797]"
        }
      >
        {invite.expires_at ? formatDate(invite.expires_at) : "-"}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (invite) => (
      <span
        className={
          invite.status === "Pending"
            ? "inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600"
            : "inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-red-50 text-red-600"
        }
      >
        <span
          className={
            invite.status === "Pending"
              ? "size-1.5 rounded-full bg-blue-600"
              : "size-1.5 rounded-full bg-red-600"
          }
        ></span>
        {invite.status}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 rounded transition-colors">
          Resend
        </button>
        <button
          className="p-1.5 hover:bg-red-50 rounded-lg text-[#4e6797] hover:text-danger transition-colors"
          title="Revoke Invitation"
        >
          <span className="material-symbols-outlined text-xl">cancel</span>
        </button>
      </div>
    ),
  },
];
