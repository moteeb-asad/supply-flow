import { DATE_RANGE_OPTIONS } from "@/src/constants/dateRangeOptions";
import { ROLES } from "@/src/constants/roles";
import { UsersFiltersValue } from "../types/filters";
import { FilterPeriod } from "@/src/lib/date-range-utils";
import {
  filterCheckboxClassName,
  filterHeadingClassName,
  filterOptionClassName,
  filterSelectClassName,
} from "@/src/components/data-table/filters/filter-styles";

export function UsersFilters({
  onChange,
  values,
}: {
  onChange: (filters: UsersFiltersValue) => void;
  values?: UsersFiltersValue;
}) {
  const handleLastLoginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FilterPeriod | "";

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

  return (
    <>
      <div>
        <h3 className={filterHeadingClassName}>Role</h3>
        <div className="space-y-2">
          {ROLES.map((role) => (
            <label key={role.id} className={filterOptionClassName}>
              <input
                type="checkbox"
                checked={(values?.roleIds || []).includes(String(role.id))}
                onChange={() => handleRoleChange(String(role.id))}
                className={filterCheckboxClassName}
              />
              <span>{role.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className={filterHeadingClassName}>Last login</h3>
        <select
          className={filterSelectClassName}
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
