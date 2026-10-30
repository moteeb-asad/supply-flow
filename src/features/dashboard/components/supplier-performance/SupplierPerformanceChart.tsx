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
import { CHART_SERIES_COLORS } from "../../constants/chart";
import type { SupplierPerformanceTrends } from "../../types";

// Register only what a line chart needs (keeps the bundle small).
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

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
    const subtle = readThemeColor("--color-subtle", "#656d68");
    const lineSoft = readThemeColor("--color-line-soft", "#e8ebe6");
    const line = readThemeColor("--color-line", "#dce0da");
    const ink = readThemeColor("--color-ink", "#191d1b");
    const surface = readThemeColor("--color-surface", "#ffffff");
    // Same font as the page (IBM Plex Sans via next/font).
    const fontFamily = getComputedStyle(document.body).fontFamily;
    const lastIndex = labels.length - 1;

    const chartData: ChartData<"line", (number | null)[], string> = {
      labels,
      datasets: series.map((item, index) => {
        const color = readThemeColor(
          CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length].cssVar,
          "#2d4bd1",
        );
        return {
          label: item.name,
          data: item.values,
          borderColor: color,
          backgroundColor: color,
          borderWidth: 2,
          borderCapStyle: "round" as const,
          borderJoinStyle: "round" as const,
          // Straight segments between weeks, as in the design.
          tension: 0,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBackgroundColor: color,
          pointBorderColor: surface,
          pointBorderWidth: 2,
          // Draw at the 0% / 100% edges instead of clipping half the line.
          clip: false as const,
          // Weeks without deliveries are null: connect across them, dashed.
          spanGaps: true,
          segment: {
            borderDash: (context: {
              p0DataIndex: number;
              p1DataIndex: number;
            }) =>
              context.p1DataIndex - context.p0DataIndex > 1
                ? [4, 4]
                : undefined,
          },
        };
      }),
    };

    const chartOptions: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      // Data is pre-sorted with unique labels; skip Chart.js checks.
      normalized: true,
      animation: { duration: 300 },
      // Room for unclipped lines and points at the 0% / 100% edges.
      layout: { padding: { top: 8, right: 8, bottom: 2 } },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          padding: 10,
          usePointStyle: true,
          backgroundColor: ink,
          titleFont: { family: fontFamily, size: 12, weight: 500 },
          bodyFont: { family: fontFamily, size: 12 },
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
          // Gridline every 25%, the 0% baseline a shade darker.
          grid: {
            color: (context) => (context.tick.value === 0 ? line : lineSoft),
          },
          border: { display: false },
          ticks: {
            stepSize: 25,
            padding: 8,
            color: subtle,
            font: { family: fontFamily, size: 11 },
            // Labels only at 0%, 50% and 100%.
            callback: (value) => (Number(value) % 50 === 0 ? `${value}%` : ""),
          },
        },
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            color: subtle,
            font: { family: fontFamily, size: 11 },
            // Every other week plus the latest, so labels never crowd.
            callback: (_value, index) =>
              index % 2 === 0 || index === lastIndex ? labels[index] : "",
          },
        },
      },
    };

    return { data: chartData, options: chartOptions };
  }, [labels, series]);

  return (
    <div className="relative h-52 w-full">
      <Line data={data} options={options} />
    </div>
  );
}
