// Series colors for dashboard charts. The legend uses the Tailwind class and
// the canvas reads the same theme variable at runtime, so both stay in sync.
export const CHART_SERIES_COLORS = [
  { className: "bg-primary", cssVar: "--color-primary" },
  { className: "bg-success", cssVar: "--color-success" },
  { className: "bg-warning", cssVar: "--color-warning" },
] as const;
