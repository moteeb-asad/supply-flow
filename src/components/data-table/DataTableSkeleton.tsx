import { DataTableSkeletonProps } from "./types";

export default function DataTableSkeleton({
  type = "loading",
}: DataTableSkeletonProps) {
  // Show 3 skeleton rows only, and a searching/loading overlay
  return (
    <>
      <div className="absolute inset-x-0 top-[140px] z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-xl border border-[#e7ebf3] dark:border-gray-700 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-[#0e121b] dark:text-white">
            {type === "search" ? "Searching..." : "Loading..."}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-[#e7ebf3] dark:divide-gray-800 opacity-40">
            {[...Array(3)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="h-4 w-32 skeleton-bar"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-48 skeleton-bar"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-16 rounded-full skeleton-bar"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-12 skeleton-bar"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-20 skeleton-bar"></div>
                </td>
                <td className="px-6 py-4"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
