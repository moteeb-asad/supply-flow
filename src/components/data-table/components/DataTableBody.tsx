import React from "react";
import type { DataTableConfig } from "../types";
type RowWithId = { id: string | number };

export function DataTableBody<T extends RowWithId, P = unknown>({
  config,
  data,
  onRowClick,
}: {
  config: DataTableConfig<T, P>;
  data: T[];
  onRowClick?: (row: T, event: React.MouseEvent) => void;
}) {
  return (
    <tbody className="divide-y divide-[#d0d7e7] dark:divide-slate-700">
      {data.length === 0 ? (
        <tr>
          <td
            colSpan={config.columns.length}
            className="text-center py-10 text-sm font-medium text-[#4e6797]"
          >
            No results found
          </td>
        </tr>
      ) : (
        data.map((row: T) => (
          <tr
            key={row.id}
            className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors ${config.rowHref ? "cursor-pointer" : ""}`}
            onClick={onRowClick ? (event) => onRowClick(row, event) : undefined}
          >
            {config.columns.map((col) => (
              <td key={col.key} className={col.className ?? "px-6 py-4"}>
                {col.cell(row)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
}
