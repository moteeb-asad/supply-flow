import type { DataTableConfig } from "../types";

export function DataTableHeader<
  T,
  P = unknown,
  TFilters extends object = Record<string, never>,
>({ config }: { config: DataTableConfig<T, P, TFilters> }) {
  return (
    <thead className="bg-background-light text-xs text-subtle">
      {/* Sunken, sentence case. Right-align number columns with headerClassName="text-right". */}
      <tr className="border-y border-line">
        {config.columns.map((col) => (
          <th
            key={col.key}
            scope="col"
            className={`px-3 py-2.5 text-left font-medium first:pl-5 last:pr-5 ${
              col.headerClassName ?? ""
            }${col.header === "Actions" ? " text-right" : ""}`}
          >
            {col.header === "Actions" ? (
              <span className="sr-only">Actions</span>
            ) : (
              col.header
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}
