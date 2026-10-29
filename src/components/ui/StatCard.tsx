import type React from "react";
import { cn } from "@/src/lib/utils";

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  // Optional now. Shown small and grey next to the label, never as a tile.
  icon?: string;
  // No longer used: coloured icon tiles are gone. Kept so call sites compile.
  iconClassName?: string;
  // Badge shown next to the value, e.g. <StatusPill tone="danger">1 critical</StatusPill>.
  hint?: React.ReactNode;
  // One line under the value, e.g. "1 draft waiting for approval".
  caption?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
};

export function StatCard({
  label,
  value,
  icon,
  hint,
  caption,
  className,
  labelClassName,
  valueClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-card border border-line bg-surface p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={cn("truncate text-[13px] text-muted", labelClassName)}>
          {label}
        </p>
        {icon ? (
          <span
            aria-hidden="true"
            className="material-symbols-outlined shrink-0 !text-[18px] text-subtle"
          >
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <p
          className={cn(
            "text-[30px] font-medium leading-9 tracking-[-0.02em] tabular-nums text-ink",
            valueClassName,
          )}
        >
          {value}
        </p>
        {hint}
      </div>
      {caption ? (
        <p className="mt-1 truncate text-[13px] text-subtle">{caption}</p>
      ) : null}
    </div>
  );
}

// Puts StatCards in one bordered strip with hairline dividers, as on every
// list screen. Works for any column count: the gap shows the line colour.
export function StatStrip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-flow-col lg:grid-cols-none lg:auto-cols-fr",
        // Cells lose their own border; an odd last cell spans the row on sm.
        "[&>*]:rounded-none [&>*]:border-0 sm:[&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:last-child:nth-child(odd)]:col-span-1",
        className,
      )}
    >
      {children}
    </section>
  );
}
