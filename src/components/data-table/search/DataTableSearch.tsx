import { useRef, useEffect, useId, useState } from "react";
import { DataTableSearchProps } from "../../data-table/types";

export default function DataTableSearch({
  value,
  applySearch,
  placeholder,
}: DataTableSearchProps) {
  const [inputValue, setInputValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputId = useId();
  const label = placeholder || "Search";

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      applySearch(inputValue);
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, applySearch]);

  return (
    <div className="relative w-full max-w-xs">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <span
        aria-hidden="true"
        className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 !text-[16px] text-subtle"
      >
        search
      </span>
      <input
        id={inputId}
        className="h-9 w-full rounded-control border border-line bg-surface pl-8 pr-3 text-[13px] text-ink placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15"
        placeholder={label}
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
