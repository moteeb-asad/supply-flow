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
import { useUser } from "@/src/providers/UserProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

export default function DashboardPage() {
  const { user, loading } = useUser();
  const displayName = user?.fullName ?? user?.email ?? "User";

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

  return (
    <>
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-[#0e121b] dark:text-white">
            Welcome back, {loading ? "..." : displayName}
          </h3>
          <p className="text-[#4e6797] text-sm mt-1">
            Here&apos;s what&apos;s happening in your warehouse today.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#1a1f2e] p-5 rounded-xl border border-[#e7ebf3] dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#4e6797]">
                Open Purchase Orders
              </span>
              <span className="material-symbols-outlined text-primary">
                description
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">24</h3>
              <span className="text-[#4e6797] text-xs font-medium">
                8 pending approval
              </span>
            </div>
          </div>
          <div className="bg-primary text-white p-5 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-8xl">
                local_shipping
              </span>
            </div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-sm font-medium text-white/80">
                Pending Deliveries
              </span>
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <div className="flex items-end justify-between relative z-10">
              <h3 className="text-3xl font-black">12</h3>
              <span className="text-white text-xs font-bold px-2 py-0.5 bg-white/20 rounded">
                4 Urgent
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a1f2e] p-5 rounded-xl border border-[#e7ebf3] dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#4e6797]">
                Low Stock Alerts
              </span>
              <div className="flex gap-1">
                <span className="size-2 rounded-full bg-danger animate-pulse"></span>
                <span className="size-2 rounded-full bg-warning"></span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-danger">15</h3>
              <span className="text-danger text-xs font-bold flex items-center gap-1">
                Critical Level
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a1f2e] p-5 rounded-xl border border-[#e7ebf3] dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#4e6797]">
                Total Monthly Spend
              </span>
              <span className="material-symbols-outlined text-success">
                payments
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">$142.5k</h3>
              <span className="text-success text-xs font-medium flex items-center">
                +4.2%
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#1a1f2e] rounded-xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-[#e7ebf3] dark:border-gray-800 flex justify-between items-center">
              <h4 className="font-bold">Recent Receiving Activity</h4>
              <button className="text-primary text-xs font-bold hover:underline">
                View All Logs
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-light dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[#4e6797]">
                      SKU / Item
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[#4e6797]">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[#4e6797]">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[#4e6797]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7ebf3] dark:divide-gray-800">
                  <tr>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">SKU-2938</p>
                      <p className="text-[10px] text-[#4e6797]">
                        Organic Avocado 48ct
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">Global Produce</td>
                    <td className="px-6 py-4 text-sm">45 cs</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success">
                        Verified
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">SKU-1102</p>
                      <p className="text-[10px] text-[#4e6797]">
                        Whole Milk 1gal
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">Dairy Co.</td>
                    <td className="px-6 py-4 text-sm">120 units</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning/10 text-warning">
                        In-Review
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">SKU-4491</p>
                      <p className="text-[10px] text-[#4e6797]">
                        Bread Flour 50lb
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">Fine Grain Mill</td>
                    <td className="px-6 py-4 text-sm">10 sk</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success">
                        Verified
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 border-b-0">
                      <p className="text-sm font-semibold">SKU-5502</p>
                      <p className="text-[10px] text-[#4e6797]">
                        Tomato Sauce 10#
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm border-b-0">Pizza Port</td>
                    <td className="px-6 py-4 text-sm border-b-0">30 cs</td>
                    <td className="px-6 py-4 border-b-0">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger/10 text-danger">
                        Partial
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-xl border border-[#e7ebf3] dark:border-gray-800 p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold">Supplier Performance Trends</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary"></span>
                  <span className="text-[10px] text-[#4e6797]">
                    Global Produce
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-success"></span>
                  <span className="text-[10px] text-[#4e6797]">Fine Grain</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-warning"></span>
                  <span className="text-[10px] text-[#4e6797]">Dairy Co.</span>
                </div>
              </div>
            </div>
            <div className="relative h-48 w-full mt-4">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl border border-[#e7ebf3] dark:border-gray-800 p-6">
          <h4 className="font-bold mb-4">Quick Tasks</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 bg-background-light dark:bg-gray-800/50 rounded-lg hover:bg-primary/5 transition-colors text-left group">
              <div className="size-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <div>
                <p className="text-sm font-bold">Generate Bill</p>
                <p className="text-[10px] text-[#4e6797]">
                  Process pending invoices
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-background-light dark:bg-gray-800/50 rounded-lg hover:bg-primary/5 transition-colors text-left group">
              <div className="size-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">
                  add_shopping_cart
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">New Order</p>
                <p className="text-[10px] text-[#4e6797]">
                  Restock low inventory
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-background-light dark:bg-gray-800/50 rounded-lg hover:bg-primary/5 transition-colors text-left group">
              <div className="size-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div>
                <p className="text-sm font-bold">Manage Vendors</p>
                <p className="text-[10px] text-[#4e6797]">
                  Update performance scores
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-background-light dark:bg-gray-800/50 rounded-lg hover:bg-primary/5 transition-colors text-left group">
              <div className="size-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">inventory</span>
              </div>
              <div>
                <p className="text-sm font-bold">Cycle Count</p>
                <p className="text-[10px] text-[#4e6797]">
                  Reconcile physical stock
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
