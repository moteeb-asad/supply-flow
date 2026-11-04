import type React from "react";
import { cn } from "@/src/lib/utils";
import { inputClassName } from "@/src/components/ui/Input";

// Shared pieces for the supplier form sections, matching the drawer design.

export const labelClassName = "text-[13px] font-medium text-muted";

// Board fields are h-9 (the shared input is h-10).
export const fieldClassName = cn(inputClassName, "mt-1.5 h-9");

export function SectionHeading({
  id,
  children,
  optional,
}: {
  id: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <h3 id={id} className="text-[13px] font-semibold">
      {children}
      {optional ? (
        <span className="font-normal text-subtle"> optional</span>
      ) : null}
    </h3>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1 text-xs text-danger">
      <span
        aria-hidden="true"
        className="material-symbols-outlined !text-[14px]"
      >
        error
      </span>
      {message}
    </p>
  );
}

// Input with a unit inside the right edge, e.g. "days" or "units".
export function WithSuffix({
  suffix,
  children,
}: {
  suffix: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mt-1.5">
      {children}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-subtle">
        {suffix}
      </span>
    </div>
  );
}
