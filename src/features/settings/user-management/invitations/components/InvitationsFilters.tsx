import type { InvitationsFiltersProps } from "../types";
import { ROLES } from "@/src/constants/roles";

export function InvitationsFilters({
  values,
  onChange,
}: InvitationsFiltersProps) {
  const roleIds: string[] = Array.isArray(values.roleIds)
    ? (values.roleIds as string[])
    : [];

  const handleRoleChange = (roleId: string) => {
    const newRoles = roleIds.includes(roleId)
      ? roleIds.filter((id) => id !== roleId)
      : [...roleIds, roleId];
    onChange({ ...values, roleIds: newRoles });
  };

  return (
    <div>
      <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
        Role Assigned
      </h3>
      <div className="space-y-2">
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
      </div>
    </div>
  );
}
