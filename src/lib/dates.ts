import { formatDistanceToNow } from "date-fns";

// All date formatting in the app goes through this file.
//
// - Fixed locale, so the server and the browser render the same text.
// - Date-only values ("2026-10-28", e.g. order_date) are calendar dates, not
//   instants: they are formatted in UTC so they never shift a day.
// - Pass `timeZone` (e.g. the visitor's zone on the server) to show a moment
//   in that zone; otherwise the runtime's zone is used.

type DateInput = string | Date | null | undefined;

const LOCALE_US = "en-US"; // "Oct 28, 2026" in tables
const LOCALE_GB = "en-GB"; // "Friday, 30 October", "7 Sep" on the dashboard

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    formatterCache.set(key, formatter);
  }
  return formatter;
}

function toDate(value: DateInput): Date | null {
  if (!value) return null;
  const date =
    value instanceof Date
      ? value
      : new Date(DATE_ONLY.test(value) ? `${value}T00:00:00Z` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Date-only strings are always UTC; everything else uses the given zone.
function zoneFor(value: DateInput, timeZone?: string) {
  return typeof value === "string" && DATE_ONLY.test(value) ? "UTC" : timeZone;
}

function format(
  value: DateInput,
  locale: string,
  options: Intl.DateTimeFormatOptions,
  fallback: string,
  timeZone?: string,
) {
  const date = toDate(value);
  if (!date) return fallback;
  return getFormatter(locale, {
    ...options,
    timeZone: zoneFor(value, timeZone),
  }).format(date);
}

/** "Oct 28, 2026". Tables and summaries. */
export const formatDate = (value: DateInput, timeZone?: string) =>
  format(
    value,
    LOCALE_US,
    { month: "short", day: "numeric", year: "numeric" },
    "—",
    timeZone,
  );

/** "Oct 28, 2026, 2:15 PM". Timelines and audit details. */
export const formatDateTime = (value: DateInput, timeZone?: string) =>
  format(
    value,
    LOCALE_US,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
    "—",
    timeZone,
  );

/** "Friday, 30 October". Page headers. */
export function formatLongDate(value: DateInput, timeZone?: string) {
  const date = toDate(value);
  if (!date) return "—";
  const parts = getFormatter(LOCALE_GB, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: zoneFor(value, timeZone),
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("weekday")}, ${part("day")} ${part("month")}`;
}

/** "October". */
export const formatMonth = (value: DateInput, timeZone?: string) =>
  format(value, LOCALE_GB, { month: "long" }, "—", timeZone);

/** "7 Sep". Chart axes. */
export const formatDayMonth = (value: DateInput, timeZone?: string) =>
  format(value, LOCALE_GB, { day: "numeric", month: "short" }, "—", timeZone);

/** "2 hours ago". `fallback` is shown for a missing date (e.g. "Never"). */
export function formatRelative(value: DateInput, fallback = "—") {
  const date = toDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : fallback;
}
