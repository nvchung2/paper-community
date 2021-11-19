const SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  MONTH = DAY * 30,
  YEAR = DAY * 365;
const labels: [string, number][] = [
  ["year", YEAR],
  ["month", MONTH],
  ["day", DAY],
  ["hour", HOUR],
  ["minute", MINUTE],
  ["second", SECOND],
];
export function timeAgo(datetime: string) {
  const interval = Date.now() - Date.parse(datetime);
  for (const [label, value] of labels) {
    const u = Math.floor(interval / value);
    if (u >= 1) {
      return `${u} ${label}${u > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
}
export function formatDate(datetime: string, fullYear = false) {
  const config: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
  };
  const date = new Date(datetime);
  if (date.getFullYear() != new Date().getFullYear()) {
    config.year = "2-digit";
  }
  if (fullYear) {
    config.year = "numeric";
  }
  return date.toLocaleDateString("en-US", config);
}
