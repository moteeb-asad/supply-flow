export const ROLES = [
  { id: "1", label: "Admin" },
  { id: "2", label: "Manager" },
  { id: "3", label: "Storekeeper" },
];

// Optionally, export a map for quick lookups
export const ROLES_MAP = Object.fromEntries(ROLES.map((r) => [r.id, r.label]));
