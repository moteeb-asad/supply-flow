import { DataTableColumn } from "@/src/components/data-table/types";
import { StatusPill } from "@/src/components/ui/StatusPill";
import { formatRole } from "@/src/lib/utils";
import { formatDate } from "@/src/lib/dates";
import { Invitation } from "../types";
import { getRoleBadgeClassName } from "../../shared/constants/role-badge";

const textButtonClassName =
  "h-8 cursor-pointer rounded-control px-2.5 text-[13px] font-medium";

export const invitationsColumns: DataTableColumn<Invitation>[] = [
  {
    key: "email",
    header: "Email",
    className: "font-medium",
    cell: (invite) => invite.email,
  },
  {
    key: "role",
    header: "Role Assigned",
    cell: (invite) => (
      <span className={getRoleBadgeClassName(invite.role?.name)}>
        {formatRole(invite.role?.name) ?? "—"}
      </span>
    ),
  },
  {
    key: "invited_by",
    header: "Invited By",
    className: "text-muted",
    cell: (invite) => invite.inviter_profile?.full_name ?? "—",
  },
  {
    key: "sent_at",
    header: "Sent Date",
    className: "whitespace-nowrap text-muted",
    cell: (invite) => formatDate(invite.sent_at),
  },
  {
    key: "expiry",
    header: "Expiry",
    className: "whitespace-nowrap",
    cell: (invite) => (
      <span
        className={invite.status === "Expired" ? "text-danger" : "text-muted"}
      >
        {formatDate(invite.expires_at)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "whitespace-nowrap",
    // Label and tone come from StatusPill (pending, accepted, expired, revoked).
    cell: (invite) => <StatusPill status={invite.status} />,
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "text-right",
    className: "text-right",
    cell: (invite) => (
      <div className="flex justify-end gap-1">
        <button
          type="button"
          className={`${textButtonClassName} text-primary hover:bg-primary-soft`}
          aria-label={`Resend invitation to ${invite.email}`}
        >
          Resend
        </button>
        <button
          type="button"
          className={`${textButtonClassName} text-muted hover:bg-danger-soft hover:text-danger`}
          title="Revoke Invitation"
          aria-label={`Revoke invitation to ${invite.email}`}
        >
          Revoke
        </button>
      </div>
    ),
  },
];
