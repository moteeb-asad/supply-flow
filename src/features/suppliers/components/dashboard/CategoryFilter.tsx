import { cn } from "@/src/lib/utils";
import type { CategoryFilterProps } from "@/src/features/suppliers/types/suppliers.types";

const categories = [
  { value: "all", label: "All" },
  { value: "dry", label: "Dry" },
  { value: "liquid", label: "Liquid" },
  { value: "fresh", label: "Fresh" },
  { value: "mixed", label: "Mixed" },
] as const;

// Segmented control: one pressed button at a time.
export default function CategoryFilter({
  value,
  onChange,
}: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Category"
      className="inline-flex rounded-control border border-line bg-background-light p-0.5"
    >
      {categories.map((category) => {
        const pressed = category.value === value;
        return (
          <button
            key={category.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(category.value)}
            className={cn(
              "h-8 cursor-pointer rounded-[5px] px-3 text-[13px] font-medium",
              pressed
                ? "bg-surface text-ink shadow-raised"
                : "text-muted hover:text-ink",
            )}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
