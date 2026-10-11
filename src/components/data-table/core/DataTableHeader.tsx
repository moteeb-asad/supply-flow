import type { DataTableConfig } from "../types";

export function DataTableHeader<
  T,
  P = unknown,
  TFilters extends object = Record<string, never>,
>({ config }: { config: DataTableConfig<T, P, TFilters> }) {
  return (
    <thead>
      <tr className="bg-slate-50 border-b border-line">
        {config.columns.map((col) => (
          <th
            key={col.key}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted ${
              col.headerClassName ?? ""
            }${col.header === "Actions" ? " text-right" : ""}`}
          >
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
