import PurchaseOrdersMetrics from "./PurchaseOrdersMetrics";
import PurchaseOrdersTable from "./PurchaseOrdersTable";

export default function PurchaseOrdersPage() {
  return (
    <>
      <div className="px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[#0e121b] dark:text-white text-3xl font-black leading-tight tracking-tight">
              Purchase Orders
            </h2>
            <p className="text-[#4e6797] dark:text-slate-400 text-sm">
              Manage and track your warehouse supply orders
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 text-[#0e121b] dark:text-white text-sm font-bold hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-lg">
                upload_file
              </span>
              <span>Bulk Upload</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Create New PO</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-8">
        <div className="flex border-b border-[#d0d7e7] dark:border-slate-700 gap-8">
          <a
            className="flex flex-col items-center justify-center border-b-[3px] active-tab pb-[13px] pt-4"
            href="#"
          >
            <p className="text-sm font-bold leading-normal tracking-wide">
              All Orders
            </p>
          </a>
          <a
            className="flex flex-col items-center justify-center border-b-[3px] inactive-tab pb-[13px] pt-4"
            href="#"
          >
            <p className="text-sm font-bold leading-normal tracking-wide">
              Draft
            </p>
          </a>
          <a
            className="flex flex-col items-center justify-center border-b-[3px] inactive-tab pb-[13px] pt-4"
            href="#"
          >
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold leading-normal tracking-wide">
                Pending
              </p>
              <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full">
                14
              </span>
            </div>
          </a>
          <a
            className="flex flex-col items-center justify-center border-b-[3px] inactive-tab pb-[13px] pt-4"
            href="#"
          >
            <p className="text-sm font-bold leading-normal tracking-wide">
              Partially Received
            </p>
          </a>
          <a
            className="flex flex-col items-center justify-center border-b-[3px] inactive-tab pb-[13px] pt-4"
            href="#"
          >
            <p className="text-sm font-bold leading-normal tracking-wide">
              Closed
            </p>
          </a>
        </div>
      </div>

      <div className="space-y-6">
        <PurchaseOrdersTable />
      </div>
      <div className="px-8 pb-8">
        <PurchaseOrdersMetrics />
      </div>
    </>
  );
}
