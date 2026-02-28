export function UsersFilters() {
  return (
    <>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Role
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

      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Last Login
        </h3>
        <select className="w-full bg-background-light border-none rounded-lg focus:ring-2 focus:ring-primary text-sm py-2 px-3">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
    </>
  );
}
