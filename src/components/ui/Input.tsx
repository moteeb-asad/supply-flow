import React from "react";
import { cn } from "@/src/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// Shared field look. Use the same string on <select> and <textarea>
// (textarea: swap h-10 for py-2) so every form control matches.
export const inputClassName =
  "block h-10 w-full rounded-control border border-line bg-surface px-3 text-sm text-ink placeholder:text-subtle transition-shadow focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-danger/12 disabled:bg-background-light disabled:text-subtle";

export function Input({ className, ...props }: InputProps) {
  return <input {...props} className={cn(inputClassName, className)} />;
}
