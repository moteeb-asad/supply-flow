"use client";

import { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CHART_SERIES_COLORS } from "../constants/chart";
import type { SupplierPerformanceTrends } from "../types";

// Register only what a line chart needs (keeps the bundle small).
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const readThemeColor = (cssVar: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() ||
  fallback;

// Client-only (loaded with ssr: false). Receives already-aggregated points,
// so rendering cost is constant no matter how much history exists.
export default function SupplierPerformanceChart({
  labels,
  series,
}: SupplierPerformanceTrends) {
  const { data, options } = useMemo(() => {
    const muted = readThemeColor("--color-muted", "#4e6797");
    const grid = readThemeColor("--color-line-soft", "#e7ebf3");

    const chartData: ChartData<"line", (number | null)[], string> = {
      labels,
      datasets: series.map((item, index) => {
        const color = readThemeColor(
          CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length].cssVar,
          "#195de6",
        );
        return {
          label: item.name,
          data: item.values,
          borderColor: color,
          backgroundColor: color,
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          // Weeks without deliveries are null: connect across them.
          spanGaps: true,
        };
      }),
    };

    const chartOptions: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      // Data is pre-sorted with unique labels; skip Chart.js checks.
      normalized: true,
      animation: { duration: 300 },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          padding: 10,
          usePointStyle: true,
          callbacks: {
            label: (context) =>
              context.parsed.y === null
                ? `${context.dataset.label}: no deliveries`
                : `${context.dataset.label}: ${context.parsed.y}% on time`,
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: grid },
          border: { display: false },
          ticks: {
            stepSize: 25,
            color: muted,
            font: { size: 10 },
            callback: (value) => `${value}%`,
          },
        },
        x: {
          grid: { display: false },
          ticks: { color: muted, font: { size: 10, weight: 500 } },
        },
      },
    };

    return { data: chartData, options: chartOptions };
  }, [labels, series]);

  return (
    <div className="relative h-48 w-full">
      <Line data={data} options={options} />
    </div>
  );
}
