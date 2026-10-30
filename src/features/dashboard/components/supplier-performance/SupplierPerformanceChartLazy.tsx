"use client";

import dynamic from "next/dynamic";

// Chart.js only runs in the browser and is large: load it after the page is
// interactive instead of shipping it with the initial dashboard bundle.
const SupplierPerformanceChartLazy = dynamic(
  () => import("./SupplierPerformanceChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-52 w-full animate-pulse rounded-control bg-background-light" />
    ),
  },
);

export default SupplierPerformanceChartLazy;
