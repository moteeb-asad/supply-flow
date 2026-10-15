const countFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCount = (value: number) => countFormatter.format(value);

export const formatCurrency = (value: number) =>
  currencyFormatter.format(value);

// Percent change vs the previous period, or null when there is nothing to
// compare against.
export function getPercentChange(current: number, previous: number) {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}
