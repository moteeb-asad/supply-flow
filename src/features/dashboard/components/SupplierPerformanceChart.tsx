"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

const chartData: ChartData<"line"> = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Global Produce",
      data: [5, 10, 25, 35, 38, 32, 35],
      borderColor: "#195de6",
      backgroundColor: "#195de6",
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
    },
    {
      label: "Fine Grain",
      data: [8, 12, 18, 20, 22, 24, 26],
      borderColor: "#10b981",
      backgroundColor: "#10b981",
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
    },
    {
      label: "Dairy Co.",
      data: [30, 25, 20, 10, 5, 4, 12],
      borderColor: "#f59e0b",
      backgroundColor: "#f59e0b",
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
    },
  ],
};

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
      padding: 12,
      titleFont: { size: 12, weight: "bold" },
      bodyFont: { size: 12 },
      usePointStyle: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(231, 235, 243, 0.5)",
      },
      ticks: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 10,
          weight: 500,
        },
        color: "#4e6797",
        autoSkip: false,
      },
    },
  },
};

export default function SupplierPerformanceChart() {
  return (
    <div className="relative h-48 w-full mt-4">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
