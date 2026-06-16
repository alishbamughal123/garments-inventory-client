export const reportChartColors = [
  "#2563eb",
  "#0f766e",
  "#ea580c",
  "#7c3aed",
  "#dc2626",
  "#0891b2",
  "#65a30d",
  "#d97706",
];

export const formatCurrency = (
  value
) =>
  `Rs. ${Number(
    value || 0
  ).toLocaleString()}`;

export const formatNumber = (
  value
) =>
  Number(value || 0).toLocaleString();

export const formatPercentage = (
  value
) => `${Number(value || 0).toFixed(2)}%`;

export const formatLabel = (
  value
) =>
  String(value || "")
    .toLowerCase()
    .split("_")
    .map(
      (segment) =>
        segment.charAt(0).toUpperCase() +
        segment.slice(1)
    )
    .join(" ");
