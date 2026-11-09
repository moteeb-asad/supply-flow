"use client";

import { useQuery } from "@tanstack/react-query";
import { StatCard, StatStrip } from "@/src/components/ui/StatCard";
import { getSkuReceivingMetricsAction } from "../../actions/get-sku-receiving-metrics.action";
import { getMetricsWindow } from "../../utils/metrics-window";
import {
  receivingKeys,
  RECEIVING_REFETCH_INTERVAL_MS,
} from "@/src/features/sku-receiving/constants/query-keys";

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
    queryKey: receivingKeys.metrics(metricsWindow.dayStart),
    queryFn: async () => {
      const result = await getSkuReceivingMetricsAction(metricsWindow);
      if (!result.success) {
        throw new Error("Failed to fetch SKU receiving metrics");
      }
      return result.data;
    },
    staleTime: 60_000,
    refetchInterval: RECEIVING_REFETCH_INTERVAL_MS,
  });

  const display = (value: (n: number) => React.ReactNode, raw?: number) => {
    if (isPending) return "…";
    if (isError || raw === undefined) return "—";
    return value(Number(raw));
  };

  const cards = [
    {
      label: "Awaiting receipt",
      value: display(
        (n) => (
          <>
            {unitsFormatter.format(n)}{" "}
            <span className="text-base font-normal text-subtle">
              {n === 1 ? "PO" : "POs"}
            </span>
          </>
        ),
        data?.awaiting_receipt_count,
      ),
    },
    {
      label: "Received today",
      value: display(unitsFormatter.format, data?.received_today_qty),
    },
    {
      label: "Variance cases this month",
      value: display(unitsFormatter.format, data?.variance_cases_mtd),
    },
    {
      label: "Value received this month",
      value: display(valueFormatter.format, data?.received_value_mtd),
    },
  ];

  return (
    <StatStrip aria-label="Receiving totals">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </StatStrip>
  );
}
