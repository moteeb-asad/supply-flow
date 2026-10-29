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
    <tbody className="divide-y divide-line-soft text-[13px] text-ink">
      {data.length === 0 ? (
        <tr>
          <td
            colSpan={config.columns.length}
            className="py-12 text-center text-[13px] text-muted"
          >
            No results found
          </td>
        </tr>
      ) : (
        data.map((row: T) => (
          <tr
            key={row.id}
            className={`transition-colors hover:bg-background-light/60 ${config.rowHref ? "cursor-pointer" : ""}`}
            onClick={onRowClick ? (event) => onRowClick(row, event) : undefined}
          >
            {config.columns.map((col) => (
              <td key={col.key} className={`px-4 py-3 ${col.className ?? ""}`}>
                {col.cell(row)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
}
