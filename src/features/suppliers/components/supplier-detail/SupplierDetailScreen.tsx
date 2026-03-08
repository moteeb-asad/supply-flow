"use client";

import { useState } from "react";
import { useSupplier } from "@/src/features/suppliers/hooks/useSupplier";
import SupplierHeader from "./header/SupplierHeader";
import { EditSupplierDrawer } from "../onboarding/EditSupplierDrawer";
import type { SupplierDetailScreenProps } from "@/src/features/suppliers/types/suppliers.types";

export default function SupplierDetailScreen({
  supplier,
}: SupplierDetailScreenProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    data: supplierData,
    isLoading,
    error,
    refetch,
  } = useSupplier(supplier.id);

  const openEditDrawer = () => setDrawerOpen(true);

  if (!supplierData) return null;

  return (
    <>
      <SupplierHeader supplier={supplierData} onEditClick={openEditDrawer} />

      <div className="px-8">
        <div className="flex border-b border-[#d0d7e7] dark:border-slate-700 gap-8">
          <a
            className="flex flex-col items-center justify-center border-b-[3px] border-primary text-primary pb-[13px] pt-4"
            href="#"
          >
            <p className="text-sm font-bold leading-normal tracking-wide">
              Performance Summary
            </p>
          </a>
          <a
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-[#4e6797] dark:text-slate-400 pb-[13px] pt-4 hover:text-primary transition-colors"
            href="#"
          >
            <p className="text-sm font-bold leading-normal tracking-wide">
              Delivery History
            </p>
          </a>
          <a
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-[#4e6797] dark:text-slate-400 pb-[13px] pt-4 hover:text-primary transition-colors"
            href="#"
          >
            <p className="text-sm font-bold leading-normal tracking-wide">
              Price History
            </p>
          </a>
          <a
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-[#4e6797] dark:text-slate-400 pb-[13px] pt-4 hover:text-primary transition-colors"
            href="#"
          >
            <p className="text-sm font-bold leading-normal tracking-wide">
              Compliance
            </p>
          </a>
        </div>
      </div>
      <div className="p-8 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 flex flex-col gap-2 rounded-xl p-6 border border-[#d0d7e7] dark:border-slate-700 shadow-sm">
            <p className="text-[#4e6797] dark:text-slate-400 text-sm font-medium">
              Avg Lead Time
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-[#0e121b] dark:text-white text-3xl font-black">
                3.2 Days
              </p>
              <span className="text-red-500 text-sm font-bold flex items-center">
                -0.5%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 flex flex-col gap-2 rounded-xl p-6 border border-[#d0d7e7] dark:border-slate-700 shadow-sm">
            <p className="text-[#4e6797] dark:text-slate-400 text-sm font-medium">
              On-Time Rate
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-[#0e121b] dark:text-white text-3xl font-black">
                94.2%
              </p>
              <span className="text-red-500 text-sm font-bold flex items-center">
                -1.2%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: "94%" }}
              ></div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 flex flex-col gap-2 rounded-xl p-6 border border-[#d0d7e7] dark:border-slate-700 shadow-sm">
            <p className="text-[#4e6797] dark:text-slate-400 text-sm font-medium">
              Fulfillment Accuracy
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-[#0e121b] dark:text-white text-3xl font-black">
                98.5%
              </p>
              <span className="text-green-500 text-sm font-bold flex items-center">
                +0.4%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
              <div
                className="bg-green-500 h-full rounded-full"
                style={{ width: "98%" }}
              ></div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 flex flex-col gap-2 rounded-xl p-6 border border-[#d0d7e7] dark:border-slate-700 shadow-sm">
            <p className="text-[#4e6797] dark:text-slate-400 text-sm font-medium">
              Active POs
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-[#0e121b] dark:text-white text-3xl font-black">
                12
              </p>
              <span className="text-green-500 text-sm font-bold flex items-center">
                +2
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>
        {/* Charts Section Mockup */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#d0d7e7] dark:border-slate-700 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Delivery Performance Trend</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-[#4e6797]">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                On-time
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#4e6797]">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                Late
              </span>
            </div>
          </div>
          <div className="h-64 relative bg-slate-50 dark:bg-slate-900/50 rounded flex items-end justify-between px-8 pb-4 border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-12 bg-primary/20 rounded-t h-[60%] relative group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                84%
              </div>
            </div>
            <div className="w-12 bg-primary/40 rounded-t h-[75%]"></div>
            <div className="w-12 bg-primary/60 rounded-t h-[90%]"></div>
            <div className="w-12 bg-primary/40 rounded-t h-[65%]"></div>
            <div className="w-12 bg-primary/80 rounded-t h-[95%]"></div>
            <div className="w-12 bg-primary/40 rounded-t h-[70%]"></div>
            <div className="w-12 bg-primary rounded-t h-[98%]"></div>
          </div>
          <div className="flex justify-between px-8 mt-4 text-xs font-medium text-[#4e6797]">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
          </div>
        </div>
        {/* Delivery History Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Deliveries</h3>
            <div className="flex gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6797] text-lg">
                  search
                </span>
                <input
                  className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Search PO#"
                  type="text"
                />
              </div>
              <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded-lg text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  filter_list
                </span>
                <span>Filters</span>
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#d0d7e7] dark:border-slate-700 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-[#d0d7e7] dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                    Qty Accuracy
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d0d7e7] dark:divide-slate-700">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">
                    Oct 24, 2023
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">
                    #PO-88421
                  </td>
                  <td className="px-6 py-4 text-sm">48 SKUs</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      Received
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    100%
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#4e6797] hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">
                    Oct 21, 2023
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">
                    #PO-88390
                  </td>
                  <td className="px-6 py-4 text-sm">12 SKUs</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                      Late (2d)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    100%
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#4e6797] hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">
                    Oct 18, 2023
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">
                    #PO-88312
                  </td>
                  <td className="px-6 py-4 text-sm">34 SKUs</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      Received
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-red-600">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        warning
                      </span>
                      <span>92%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#4e6797] hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">
                    Oct 15, 2023
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">
                    #PO-88255
                  </td>
                  <td className="px-6 py-4 text-sm">62 SKUs</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                      Partial
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-red-600">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        warning
                      </span>
                      <span>85%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#4e6797] hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <p className="text-xs text-[#4e6797] font-medium tracking-wide">
                Showing 4 of 128 deliveries
              </p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded text-xs font-bold disabled:opacity-50"
                  disabled={"disabled" as unknown as boolean}
                >
                  Previous
                </button>
                <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded text-xs font-bold hover:bg-slate-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {drawerOpen && (
        <EditSupplierDrawer
          supplier={supplierData!}
          onClose={() => setDrawerOpen(false)}
          onSuccess={() => {
            console.log("Edit success: triggering refetch...");
            refetch();
          }}
        />
      )}
    </>
  );
}
