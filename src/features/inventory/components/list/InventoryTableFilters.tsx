"use client";

export default function InventoryTableFilters() {
  return (
    <>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Category
        </h3>
        <select className="w-full bg-white border border-[#d0d7e7] rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
          <option key="" value="">
            All Categories
          </option>
          <option key="meat_poultry" value="meat_poultry">
            Meat & Poultry
          </option>
        </select>
      </div>
      <div>
        <h3 className="text-xs font-bold text-[#4e6797] uppercase tracking-wider mb-3">
          Stock Status
        </h3>
        <select className="w-full bg-white border border-[#d0d7e7] rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
          <option key="" value="">
            All Stock Statuses
          </option>
          <option key="good" value="good">
            Good
          </option>
          <option key="low" value="low">
            Low
          </option>
          <option key="critical" value="critical">
            Critical
          </option>
        </select>
      </div>
    </>
  );
}
