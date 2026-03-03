import type { Supplier } from "@/src/features/suppliers/types/suppliers.types";

type SupplierCardProps = {
  supplier: Supplier;
};

const formatCategory = (category: string | null) => {
  if (!category) {
    return "Uncategorized";
  }
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const getCategoryIcon = (category: string | null) => {
  switch (category) {
    case "dry":
      return "inventory";
    case "liquid":
      return "water_drop";
    case "mixed":
      return "layers";
    default:
      return "inventory_2";
  }
};

export default function SupplierCard({ supplier }: SupplierCardProps) {
  const status = supplier.status ?? "active";
  const statusStyles =
    status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-amber-100 text-amber-700";

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#d0d7e7] dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group cursor-pointer p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-symbols-outlined text-2xl">
              {getCategoryIcon(supplier.category)}
            </span>
          </div>
          <span
            className={`${statusStyles} text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter`}
          >
            {status}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#0e121b] dark:text-white group-hover:text-primary transition-colors">
          {supplier.name}
        </h3>
        <p className="text-[#4e6797] dark:text-slate-400 text-xs mb-6">
          {formatCategory(supplier.category)}
        </p>
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#4e6797] uppercase tracking-wider mb-1">
              Lead Time
            </span>
            <span className="text-sm font-bold text-[#0e121b] dark:text-white">
              {supplier.lead_time_days ?? "-"} Days
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-[#4e6797] uppercase tracking-wider mb-1">
              Min Order
            </span>
            <span className="text-sm font-bold text-[#0e121b] dark:text-white">
              {supplier.min_order_qty ?? "-"}
            </span>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <span className="text-xs font-medium text-[#4e6797]">
            {supplier.primary_contact_name ?? "No contact"}
          </span>
          <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
            arrow_forward
          </span>
        </div>
      </div>
    </>
  );
}
