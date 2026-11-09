import type React from "react";
import { cn } from "@/src/lib/utils";

export type StatusTone =
  "success" | "primary" | "warning" | "danger" | "neutral";

const toneClassName: Record<StatusTone, { pill: string; dot: string }> = {
  success: { pill: "bg-success-soft text-success", dot: "bg-success" },
  primary: { pill: "bg-primary-soft text-primary", dot: "bg-primary" },
  warning: { pill: "bg-warning-soft text-warning", dot: "bg-warning" },
  danger: { pill: "bg-danger-soft text-danger", dot: "bg-danger" },
  neutral: { pill: "bg-neutral-soft text-neutral", dot: "bg-neutral" },
};

// Every status the app shows, in one place. Replaces the statusStyles maps in
// purchase orders, SKU receiving, suppliers and invitations.
const STATUSES: Record<string, { label: string; tone: StatusTone }> = {
  // Purchase orders
  draft: { label: "Draft", tone: "neutral" },
  pending: { label: "Pending", tone: "warning" },
  partially_received: { label: "Partially received", tone: "primary" },
  closed: { label: "Closed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  overdue: { label: "Overdue", tone: "danger" },
  // SKU receiving (plus pending, partially_received, overdue above)
  in_progress: { label: "In progress", tone: "primary" },
  received: { label: "Received", tone: "success" },
  variance_flagged: { label: "Variance flagged", tone: "warning" },
  // Suppliers and users
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "neutral" },
  // Stock levels
  good: { label: "Good", tone: "success" },
  low: { label: "Low", tone: "warning" },
  critical: { label: "Critical", tone: "danger" },
  // Invitations
  accepted: { label: "Accepted", tone: "success" },
  expired: { label: "Expired", tone: "danger" },
  revoked: { label: "Revoked", tone: "neutral" },
};

export function getStatus(status: string): { label: string; tone: StatusTone } {
  const key = status
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return (
    STATUSES[key] ?? {
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
      tone: "neutral",
    }
  );
}

type StatusPillProps = {
  // A known status key, e.g. "partially_received". Sets label and tone.
  status?: string;
  // Or pass a tone and your own text: <StatusPill tone="danger">1 critical</StatusPill>
  tone?: StatusTone;
  children?: React.ReactNode;
  className?: string;
};

export function StatusPill({
  status,
  tone,
  children,
  className,
}: StatusPillProps) {
  const known = status ? getStatus(status) : null;
  const resolvedTone = tone ?? known?.tone ?? "neutral";
  const styles = toneClassName[resolvedTone];

  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-xs font-medium",
        styles.pill,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", styles.dot)}
      />
      {children ?? known?.label}
    </span>
  );
}
