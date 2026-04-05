"use client";

import InventoryMetrics from "../InventoryMetrics";
import InventoryTable from "../list/InventoryTable";

export default function InventoryManagementScreen() {
  return (
    <>
      <div className="px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[#0e121b] text-3xl font-black leading-tight tracking-tight">
              Inventory Management
            </h2>
            <p className="text-[#4e6797] text-sm">
              Manage and track your warehouse supply orders
            </p>
          </div>
          <div className="flex gap-3">
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                download
              </span>{" "}
              Export CSV
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-lg">add</span>
              <span role="button">Add Item</span>
            </button>
          </div>
        </div>
      </div>

      <InventoryMetrics />
      <InventoryTable />
    </>
  );
}
