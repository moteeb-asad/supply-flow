"use client";

import { useEffect, useState } from "react";
import type { SupplierSearchProps } from "@/src/features/suppliers/types/suppliers.types";
import { Input } from "@/src/components/ui/Input";

const DEFAULT_DEBOUNCE_MS = 350;

export default function SupplierSearch({
  defaultValue = "",
  debounceMs = DEFAULT_DEBOUNCE_MS,
  onSearchChange,
}: SupplierSearchProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const handle = setTimeout(() => {
      onSearchChange(value.trim());
    }, debounceMs);

    return () => clearTimeout(handle);
  }, [debounceMs, onSearchChange, value]);

  return (
    <>
      <div className="flex-1 min-w-[300px] max-w-md relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6797] text-xl">
          search
        </span>
        <Input
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#d0d7e7] rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          placeholder="Search suppliers by name..."
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </>
  );
}
