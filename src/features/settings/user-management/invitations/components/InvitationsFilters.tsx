export function InvitationsFilters() {
  return (
    <>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Role Assigned
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="rounded border-gray-300  text-primary focus:ring-primary bg-transparent"
            />
            <span className="text-sm">Admin</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="rounded border-gray-300  text-primary focus:ring-primary bg-transparent"
            />
            <span className="text-sm">Manager</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="rounded border-gray-300  text-primary focus:ring-primary bg-transparent"
            />
            <span className="text-sm">Storekeeper</span>
          </label>
        </div>
      </div>
    </>
  );
}
