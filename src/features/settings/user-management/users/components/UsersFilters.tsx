import { DATE_RANGE_OPTIONS } from "@/src/constants/dateRangeOptions";
import { ROLES } from "@/src/constants/roles";
import { UserFiltersValue } from "../types/filters";
import { FilterPeriod } from "@/src/lib/date-range-utils";

export function UsersFilters({
  onChange,
  values,
}: {
  onChange: (filters: UserFiltersValue) => void;
  values?: UserFiltersValue;
}) {
  const handleLastLoginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FilterPeriod | "";
    console.log("Selected last login filter:", value);

    // Pass the updated values, preserving other filters
    onChange({
      ...values,
      lastLogin: value || undefined,
    });
  };

  const handleRoleChange = (roleId: string) => {
    const currentRoleIds = values?.roleIds || [];
    const newRoleIds = currentRoleIds.includes(roleId)
      ? currentRoleIds.filter((id) => id !== roleId)
      : [...currentRoleIds, roleId];

    onChange({
      ...values,
      roleIds: newRoleIds.length > 0 ? newRoleIds : undefined,
    });
  };

  console.log("Dropdown value:", values?.lastLogin);

  return (
    <>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Role
        </h3>
        <div className="space-y-2">
          {ROLES.map((role) => (
            <label key={role.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={(values?.roleIds || []).includes(String(role.id))}
                onChange={() => handleRoleChange(String(role.id))}
                className="rounded border-gray-300 text-primary focus:ring-primary bg-transparent"
              />
              <span className="text-sm">{role.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Last Login
        </h3>
        <select
          className="w-full bg-background-light border-none rounded-lg focus:ring-2 focus:ring-primary text-sm py-2 px-3"
          value={values?.lastLogin || ""}
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
