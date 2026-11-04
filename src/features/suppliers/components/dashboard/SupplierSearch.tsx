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
    <div className="relative w-full max-w-xs">
      <label htmlFor="supplier-search" className="sr-only">
        Search suppliers
      </label>
      <span
        aria-hidden="true"
        className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 !text-[16px] text-subtle"
      >
        search
      </span>
      <Input
        id="supplier-search"
        className="h-9 pl-8 text-[13px]"
        placeholder="Search suppliers by name"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
