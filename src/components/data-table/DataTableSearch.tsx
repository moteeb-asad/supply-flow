import { useRef, useEffect, useState } from "react";
import { DataTableSearchProps } from "./types";

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
    <div className="relative w-80">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6797] text-xl">
        search
      </span>
      <input
        className="w-full pl-10 pr-4 py-2 bg-background-light border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
        placeholder={placeholder || "Search..."}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
