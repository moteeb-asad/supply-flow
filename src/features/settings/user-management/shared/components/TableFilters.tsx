"use client";

import { TableFiltersProps } from "../types";

export default function TableFilters({
  value,
  onChange,
  onClose,
  onApply,
  onClear,
}: TableFiltersProps) {
  const { roles, lastLoginRange } = value;

  const toggleRole = (role: string) => {
    const newRoles = roles.includes(role)
      ? roles.filter((item) => item !== role)
      : [...roles, role];
    onChange({ ...value, roles: newRoles });
  };

  const handleClear = () => {
    onChange({ roles: [], lastLoginRange: "Last 7 days" });
    onClear?.();
  };

  const handleApply = () => {
    onApply?.(value);
    onClose?.();
  };

  return (
    <div className="absolute top-25 right-12 z-50 w-80 bg-white rounded-xl shadow-2xl border border-[#e7ebf3] flex flex-col overflow-hidden max-h-[calc(100vh-150px)] overflow-y-auto">
      <div className="p-5 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
            Role
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                checked={roles.includes("super_admin")}
                onChange={() => toggleRole("super_admin")}
                className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
                type="checkbox"
              />
              <span className="text-sm text-[#0e121b] group-hover:text-primary transition-colors">
                Admin
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                checked={roles.includes("operations_manager")}
                onChange={() => toggleRole("operations_manager")}
                className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
                type="checkbox"
              />
              <span className="text-sm text-[#0e121b] group-hover:text-primary transition-colors">
                Operations Manager
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                checked={roles.includes("store_keeper")}
                onChange={() => toggleRole("store_keeper")}
                className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
                type="checkbox"
              />
              <span className="text-sm text-[#0e121b] group-hover:text-primary transition-colors">
                Storekeeper
              </span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
            Last Login
          </h3>
          <div className="space-y-3">
            <select
              value={lastLoginRange}
              onChange={(event) =>
                onChange({ ...value, lastLoginRange: event.target.value })
              }
              className="w-full bg-background-light border-none rounded-lg focus:ring-2 focus:ring-primary text-sm py-2 px-3"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-[#e7ebf3] bg-gray-50/50 flex items-center justify-between">
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-semibold text-[#4e6797] hover:text-danger transition-colors px-2 py-1 cursor-pointer"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
