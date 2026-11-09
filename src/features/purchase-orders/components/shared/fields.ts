import { cn } from "@/src/lib/utils";
import { inputClassName } from "@/src/components/ui/Input";

// Shared classes for the purchase order form, matching the drawer design.
export const sectionHeadingClassName = "text-[13px] font-semibold";
export const labelClassName = "text-[13px] font-medium text-muted";
export const errorClassName = "mt-1.5 text-xs text-danger";
// Board fields are h-9 (the shared input is h-10).
export const fieldClassName = cn(inputClassName, "mt-1.5 h-9");
