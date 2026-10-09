"use client";

import { useQuery } from "@tanstack/react-query";
import { getSkuReceivingMetricsAction } from "../../actions/get-sku-receiving-metrics.action";
import { getMetricsWindow } from "../../utils/metrics-window";

const unitsFormatter = new Intl.NumberFormat("en-US");
const valueFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function SkuReceivingMetrics() {
  // Part of the key so the cards roll over at local midnight / month start.
  const metricsWindow = getMetricsWindow();

  const { data, isPending, isError } = useQuery({
    queryKey: ["sku-receiving-metrics", metricsWindow.dayStart],
    queryFn: async () => {
      const result = await getSkuReceivingMetricsAction(metricsWindow);
      if (!result.success) {
        throw new Error("Failed to fetch SKU receiving metrics");
      }
      return result.data;
    },
    staleTime: 60_000,
  });

  const display = (value: (n: number) => string, raw?: number) => {
    if (isPending) return "…";
    if (isError || raw === undefined) return "—";
    return value(Number(raw));
  };

  const cards = [
    {
      label: "Awaiting Receipt",
      icon: "receipt_long",
      iconClassName: "bg-blue-50 text-primary",
      value: display(
        (n) => `${unitsFormatter.format(n)} ${n === 1 ? "PO" : "POs"}`,
        data?.awaiting_receipt_count,
      ),
    },
    {
      label: "Received Today",
      icon: "inventory_2",
      iconClassName: "bg-green-50 text-green-600",
      value: display(unitsFormatter.format, data?.received_today_qty),
    },
    {
      label: "Variance Cases (MTD)",
      icon: "warning",
      iconClassName: "bg-red-50 text-red-600",
      value: display(unitsFormatter.format, data?.variance_cases_mtd),
    },
    {
      label: "Value (MTD)",
      icon: "payments",
      iconClassName: "bg-purple-50 text-purple-600",
      value: display(valueFormatter.format, data?.received_value_mtd),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4"
        >
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.iconClassName}`}
          >
            <span className="material-symbols-outlined">{card.icon}</span>
          </div>
          <div>
            <p className="text-[#4e6797] text-xs font-bold uppercase tracking-wider">
              {card.label}
            </p>
            <p className="text-2xl font-black text-[#0e121b]">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
