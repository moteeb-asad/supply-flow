import { useRef, useEffect, useState } from "react";
import { DataTableSearchProps } from "../../data-table/types";

export default function DataTableSearch({
  value,
  applySearch,
  placeholder,
}: DataTableSearchProps) {
  const [inputValue, setInputValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <div className="relative w-full max-w-md">
      <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-muted !text-[18px]">
        search
      </span>
      <input
        className="h-9 w-full pl-9 pr-3 bg-white border border-line rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all "
        placeholder={placeholder || "Search..."}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
