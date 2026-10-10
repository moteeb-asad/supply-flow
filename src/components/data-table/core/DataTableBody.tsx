import React from "react";
import type { DataTableConfig } from "../types";
type RowWithId = { id: string | number };

export function DataTableBody<
  T extends RowWithId,
  P = unknown,
  TFilters extends object = Record<string, never>,
>({
  config,
  data,
  onRowClick,
}: {
  config: DataTableConfig<T, P, TFilters>;
  data: T[];
  onRowClick?: (row: T, event: React.MouseEvent) => void;
}) {
  return (
    <tbody className="divide-y divide-line">
      {data.length === 0 ? (
        <tr>
          <td
            colSpan={config.columns.length}
            className="text-center py-10 text-sm font-medium text-muted"
          >
            No results found
          </td>
        </tr>
      ) : (
        data.map((row: T) => (
          <tr
            key={row.id}
            className={`hover:bg-slate-50/50 transition-colors ${config.rowHref ? "cursor-pointer" : ""}`}
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
