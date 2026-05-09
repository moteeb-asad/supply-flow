import type { DataTableConfig } from "../types";

export function DataTableHeader<
  T,
  P = unknown,
  TFilters extends object = Record<string, never>,
>({ config }: { config: DataTableConfig<T, P, TFilters> }) {
  return (
    <thead>
      <tr className="bg-slate-50 border-b border-[#d0d7e7]">
        {config.columns.map((col) => (
          <th
            key={col.key}
            className={
              `px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider ` +
              (col.className ?? "") +
              (col.header === "Actions" ? " text-right" : "")
            }
          >
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
