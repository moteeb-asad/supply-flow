import type { DataTableConfig } from "../types";

export function DataTableHeader<
  T,
  P = unknown,
  TFilters extends object = Record<string, never>,
>({ config }: { config: DataTableConfig<T, P, TFilters> }) {
  return (
    <thead>
      {/* Sunken, sentence case. Right-align number columns with headerClassName="text-right". */}
      <tr className="border-b border-line bg-background-light">
        {config.columns.map((col) => (
          <th
            key={col.key}
            scope="col"
            className={`px-4 py-2.5 text-left text-xs font-medium text-subtle ${
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
