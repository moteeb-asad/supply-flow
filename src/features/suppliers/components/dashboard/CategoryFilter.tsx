import type { CategoryFilterProps } from "@/src/features/suppliers/types/suppliers.types";

const categories = [
  { value: "all", label: "All" },
  { value: "dry", label: "Dry" },
  { value: "liquid", label: "Liquid" },
  { value: "fresh", label: "Fresh" },
  { value: "mixed", label: "Mixed" },
] as const;

export default function CategoryFilter({
  value,
  onChange,
}: CategoryFilterProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-[#4e6797] mr-2">
          Filter by Category:
        </span>
        <div className="flex bg-white border border-[#d0d7e7] p-1 rounded-lg">
          {categories.map((category) => (
            <button
              key={category.value}
              className={`
                ${
                  category.value === value
                    ? "px-4 py-1.5 text-xs font-bold rounded-md bg-primary text-white"
                    : "px-4 py-1.5 text-xs font-bold rounded-md text-[#4e6797] hover:bg-slate-100"
                } cursor-pointer`}
              onClick={() => onChange(category.value)}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
