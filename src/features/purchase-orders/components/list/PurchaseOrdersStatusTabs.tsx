"use client";

const STATUS_TABS = [
  { key: undefined, label: "All Orders" },
  { key: "draft", label: "Draft" },
  { key: "pending", label: "Pending" },
  { key: "partially_received", label: "Partially Received" },
  { key: "closed", label: "Closed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "overdue", label: "Overdue" },
];

export default function PurchaseOrdersStatusTabs({
  status,
  onStatusChange,
}: {
  status?: string;
  onStatusChange: (status?: string) => void;
}) {
  return (
    <div className="flex border-b border-[#d0d7e7] dark:border-slate-700 gap-8">
      {STATUS_TABS.map((tab) => (
        <button
          key={tab.key ?? "all"}
          className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 text-sm font-bold leading-normal tracking-wide transition-colors cursor-pointer ${
            status === tab.key || (!status && tab.key === undefined)
              ? "active-tab border-primary text-primary"
              : "inactive-tab border-transparent text-[#4e6797]"
          }`}
          onClick={() => {
            onStatusChange(tab.key);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
