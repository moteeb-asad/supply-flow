"use client";

import { useState } from "react";
import { useSupplier } from "@/src/features/suppliers/hooks/useSupplier";
import SupplierHeader from "./header/SupplierHeader";
import { EditSupplierDrawer } from "../onboarding/EditSupplierDrawer";
import type { SupplierDetailScreenProps } from "@/src/features/suppliers/types/suppliers.types";
import { Button } from "@/src/components/ui/Button";
import { StatCard, StatStrip } from "@/src/components/ui/StatCard";
import {
  StatusPill,
  getStatus,
  type StatusTone,
} from "@/src/components/ui/StatusPill";
import { formatCategory } from "@/src/features/suppliers/utils/category";
import { cn } from "@/src/lib/utils";

// Placeholder content below (KPIs, chart bars, deliveries) is not real data
// yet; see the card "Supplier metrics and supplier detail page from real data".

const TABS = ["Performance", "Delivery history", "Price history", "Compliance"];

const KPIS: { label: string; value: string; change: string; good: boolean }[] =
  [
    { label: "Avg lead time", value: "3.2 days", change: "-0.5%", good: false },
    { label: "On-time rate", value: "94.2%", change: "-1.2%", good: false },
    {
      label: "Fulfillment accuracy",
      value: "98.5%",
      change: "+0.4%",
      good: true,
    },
    { label: "Active POs", value: "12", change: "+2", good: true },
  ];

const TREND_BARS = [
  { month: "Jan", height: "60%" },
  { month: "Feb", height: "75%" },
  { month: "Mar", height: "90%" },
  { month: "Apr", height: "65%" },
  { month: "May", height: "95%" },
  { month: "Jun", height: "70%" },
  { month: "Jul", height: "98%" },
];

const DELIVERIES: {
  date: string;
  poNumber: string;
  items: string;
  status: string;
  tone: StatusTone;
  accuracy: string;
}[] = [
  {
    date: "Oct 24, 2023",
    poNumber: "PO-88421",
    items: "48 SKUs",
    status: "Received",
    tone: "success",
    accuracy: "100%",
  },
  {
    date: "Oct 21, 2023",
    poNumber: "PO-88390",
    items: "12 SKUs",
    status: "Late (2d)",
    tone: "danger",
    accuracy: "100%",
  },
  {
    date: "Oct 18, 2023",
    poNumber: "PO-88312",
    items: "34 SKUs",
    status: "Received",
    tone: "success",
    accuracy: "92%",
  },
  {
    date: "Oct 15, 2023",
    poNumber: "PO-88255",
    items: "62 SKUs",
    status: "Partial",
    tone: "warning",
    accuracy: "85%",
  },
];

const DELIVERY_HEADERS: { label: string; className: string }[] = [
  { label: "Delivery date", className: "px-5" },
  { label: "PO number", className: "px-3" },
  { label: "Items", className: "px-3 text-right" },
  { label: "Status", className: "px-3" },
  { label: "Qty accuracy", className: "px-3 text-right" },
  { label: "Actions", className: "px-5 text-right" },
];

export default function SupplierDetailScreen({
  supplier,
}: SupplierDetailScreenProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: supplierData } = useSupplier(supplier.id);

  const openEditDrawer = () => setDrawerOpen(true);

  if (!supplierData) return null;

  // Already loaded with the supplier; no extra queries.
  const details = [
    {
      label: "Contact person",
      value: supplierData.primary_contact_name ?? "—",
    },
    { label: "Category", value: formatCategory(supplierData.category) },
    {
      label: "Lead time",
      value:
        supplierData.lead_time_days != null
          ? `${supplierData.lead_time_days} days`
          : "—",
      numeric: true,
    },
    {
      label: "Minimum order",
      value:
        supplierData.min_order_qty != null
          ? `${supplierData.min_order_qty} units`
          : "—",
      numeric: true,
    },
    {
      label: "Status",
      value: getStatus(supplierData.status ?? "active").label,
    },
  ];

  return (
    <>
      <header className="px-8 pt-6">
        <SupplierHeader supplier={supplierData} onEditClick={openEditDrawer} />

        <div className="relative mt-6 overflow-x-auto border-b border-line">
          <div
            role="tablist"
            aria-label="Supplier sections"
            className="flex min-w-max gap-6"
          >
            {TABS.map((tab, index) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={index === 0}
                className={cn(
                  "-mb-px h-11 cursor-pointer border-b-2 text-[13px] font-medium",
                  index === 0
                    ? "border-ink text-ink"
                    : "border-transparent text-muted hover:text-ink",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="space-y-6 px-8 pb-8 pt-6">
        <StatStrip aria-label="Performance">
          {KPIS.map((kpi) => (
            <StatCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              hint={
                <span
                  className={cn(
                    "text-[13px]",
                    kpi.good ? "text-success" : "text-danger",
                  )}
                >
                  {kpi.change}
                </span>
              }
            />
          ))}
        </StatStrip>

        <div className="grid gap-6 xl:grid-cols-3">
          <section
            aria-labelledby="delivery-trend-title"
            className="min-w-0 rounded-card border border-line p-5 xl:col-span-2"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2
                id="delivery-trend-title"
                className="text-[15px] font-semibold"
              >
                Delivery performance trend
              </h2>
              <ul className="flex gap-4 text-[13px] text-muted">
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-sm bg-chart-1"
                  />
                  On time
                </li>
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-sm bg-chart-3"
                  />
                  Late
                </li>
              </ul>
            </div>
            <div className="mt-4">
              <div className="flex h-56 items-end justify-between gap-3 border-b border-line px-2">
                {TREND_BARS.map((bar) => (
                  <div
                    key={bar.month}
                    className="w-full max-w-12 rounded-t-[3px] bg-chart-1"
                    style={{ height: bar.height }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between gap-3 px-2 text-xs text-subtle">
                {TREND_BARS.map((bar) => (
                  <span key={bar.month} className="w-full max-w-12 text-center">
                    {bar.month}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="supplier-details-title"
            className="rounded-card border border-line p-5"
          >
            <h2
              id="supplier-details-title"
              className="text-[15px] font-semibold"
            >
              Supplier details
            </h2>
            <dl className="mt-3 divide-y divide-line-soft text-[13px]">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex justify-between gap-4 py-2.5"
                >
                  <dt className="text-muted">{detail.label}</dt>
                  <dd
                    className={cn(
                      "text-right",
                      detail.numeric && "tabular-nums",
                    )}
                  >
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section
          aria-labelledby="deliveries-title"
          className="overflow-hidden rounded-card border border-line"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <h2 id="deliveries-title" className="text-[15px] font-semibold">
              Recent deliveries
            </h2>
            <div className="flex gap-2">
              <div className="relative w-full max-w-60">
                <label htmlFor="delivery-search" className="sr-only">
                  Search deliveries by PO number
                </label>
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 !text-[16px] text-subtle"
                >
                  search
                </span>
                <input
                  id="delivery-search"
                  type="search"
                  placeholder="Search PO number"
                  className="h-9 w-full rounded-control border border-line bg-surface pl-8 pr-3 text-[13px] text-ink placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15"
                />
              </div>
              <Button variant="secondary" size="md">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined !text-[18px]"
                >
                  tune
                </span>
                Filters
              </Button>
            </div>
          </div>

          <div className="scrollbar-thin relative overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
              <thead className="bg-background-light text-xs text-subtle">
                <tr className="border-y border-line">
                  {DELIVERY_HEADERS.map(({ label, className }) => (
                    <th
                      key={label}
                      scope="col"
                      className={`${className} py-2.5 font-medium`}
                    >
                      {label === "Actions" ? (
                        <span className="sr-only">{label}</span>
                      ) : (
                        label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {DELIVERIES.map((delivery) => (
                  <tr
                    key={delivery.poNumber}
                    className="hover:bg-background-light/60"
                  >
                    <td className="px-5 py-3 text-muted">{delivery.date}</td>
                    <td className="px-3 py-3 font-mono text-[12.5px] font-medium">
                      {delivery.poNumber}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {delivery.items}
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill tone={delivery.tone}>
                        {delivery.status}
                      </StatusPill>
                    </td>
                    <td
                      className={cn(
                        "px-3 py-3 text-right tabular-nums",
                        delivery.accuracy !== "100%" && "text-warning",
                      )}
                    >
                      {delivery.accuracy}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        aria-label={`More actions for ${delivery.poNumber}`}
                        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-control text-subtle hover:bg-background-light hover:text-ink"
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined !text-[18px]"
                        >
                          more_horiz
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-line px-5 py-3">
            <p className="text-[13px] text-muted">
              Showing 4 of 128 deliveries
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled>
                Previous
              </Button>
              <Button variant="secondary" size="sm">
                Next
              </Button>
            </div>
          </div>
        </section>
      </div>

      {drawerOpen && (
        <EditSupplierDrawer
          supplier={supplierData}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
