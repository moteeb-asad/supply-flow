import { DATE_RANGE_OPTIONS } from "@/src/constants/dateRangeOptions";
import { ROLES } from "@/src/constants/roles";
import { Filters, ValuesProps } from "../types/filters";
import { FilterPeriod } from "@/src/lib/date-range-utils";

export function UsersFilters({
  onChange,
}: {
  onChange: (filters: Filters) => void;
}) {
  const handleLastLoginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FilterPeriod;
    onChange({ filters: { lastLogin: value } });
  };

  return (
    <>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Role
        </h3>
        {/* <div className="space-y-2">
            {ROLES.map((role) => (
              <label key={role.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={roleIds.includes(role.id)}
                  onChange={() => handleRoleChange(role.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
                />
                <span className="text-sm">{role.label}</span>
              </label>
            ))}
          </div> */}
      </div>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Last Login
        </h3>
        <select
          className="w-full bg-background-light border-none rounded-lg focus:ring-2 focus:ring-primary text-sm py-2 px-3"
          onChange={handleLastLoginChange}
        >
          {DATE_RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
