import type React from "react";
import { cn } from "@/src/lib/utils";

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  icon: string;
  // Icon tile colors, e.g. "bg-blue-50 text-primary".
  iconClassName?: string;
  // Small text or badge shown next to the value.
  hint?: React.ReactNode;
  // Overrides for tinted or highlighted cards.
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
};

export function StatCard({
  label,
  value,
  icon,
  iconClassName,
  hint,
  className,
  labelClassName,
  valueClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-line-soft bg-white px-4 py-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-primary",
          iconClassName,
        )}
      >
        <span className="material-symbols-outlined !text-[20px]">{icon}</span>
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-xs font-semibold uppercase tracking-wider text-muted",
            labelClassName,
          )}
        >
          {label}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p
            className={cn(
              "text-xl font-bold leading-tight text-ink",
              valueClassName,
            )}
          >
            {value}
          </p>
          {hint}
        </div>
      </div>
    </div>
  );
}
