import { cn } from "@/src/lib/utils";
import { inputClassName } from "@/src/components/ui/Input";

// Shared look for the fields inside the Filters popover (matches inventory).
export const filterHeadingClassName = "mb-2 text-[13px] font-semibold";
export const filterSelectClassName = cn(
  inputClassName,
  "h-9 cursor-pointer text-[13px]",
);
export const filterCheckboxClassName = "size-4 cursor-pointer accent-ink";
export const filterOptionClassName =
  "flex cursor-pointer items-center gap-2.5 text-[13px]";
