import type { SupplierHeaderProps } from "@/src/features/suppliers/types/suppliers.types";
import Link from "next/link";

const formatStatus = (status: string | null) => {
  if (!status) {
    return "Active";
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function SupplierHeader({ supplier }: SupplierHeaderProps) {
  const status = supplier.status ?? "active";
  const statusStyles =
    status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-amber-100 text-amber-700";

  const email = supplier.primary_contact_email ?? "No email";
  const phone = supplier.primary_contact_phone ?? "No phone";

  return (
    <>
      <div className="px-8 pt-6">
        <div className="flex items-center gap-2 text-sm">
          <Link
            className="text-[#4e6797] dark:text-slate-400 font-medium hover:text-primary transition-colors"
            href="/suppliers"
          >
            Suppliers
          </Link>
          <span className="text-[#4e6797] dark:text-slate-500">/</span>
          <span className="text-[#0e121b] dark:text-white font-medium">
            {supplier.name}
          </span>
        </div>
      </div>
      <div className="px-8 py-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-[#0e121b] dark:text-white text-4xl font-black leading-tight tracking-tight">
                {supplier.name}
              </h2>
              <span
                className={`${statusStyles} text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}
              >
                {formatStatus(status)}
              </span>
            </div>
            <p className="text-[#4e6797] dark:text-slate-400 text-base font-normal flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">mail</span>
                {email}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">call</span>
                {phone}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 text-[#0e121b] dark:text-white text-sm font-bold hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-lg">
                download
              </span>
              <span>Export Report</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined text-lg">edit</span>
              <span>Edit Supplier</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
