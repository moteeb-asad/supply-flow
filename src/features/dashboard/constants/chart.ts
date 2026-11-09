// Series colours for dashboard charts (chart-1..3 tokens). The legend uses the
// Tailwind class and the canvas reads the same theme variable at runtime, so
// both stay in sync.
export const CHART_SERIES_COLORS = [
  { borderClassName: "border-chart-1", cssVar: "--color-chart-1" },
  { borderClassName: "border-chart-2", cssVar: "--color-chart-2" },
  { borderClassName: "border-chart-3", cssVar: "--color-chart-3" },
] as const;
