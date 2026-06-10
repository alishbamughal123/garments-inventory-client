export const sizeOptions = [
  "",
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "OS",
];

const normalizeToken = (
  value = ""
) =>
  String(value)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9/ -]/g, "");

export const generateColorCode = (
  color = ""
) => {
  const normalized =
    normalizeToken(color).replace(
      /\//g,
      " "
    );

  if (!normalized) {
    return "";
  }

  const words = normalized
    .split(/[\s-]+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 3);
  }

  return words
    .map((word) => word[0])
    .join("")
    .slice(0, 4);
};

export const buildStyleNumber = ({
  baseStyleNumber,
  size,
  colorCode,
}) =>
  [
    normalizeToken(
      baseStyleNumber
    ),
    normalizeToken(size).replace(
      /\s+/g,
      ""
    ) || null,
    normalizeToken(
      colorCode
    ).replace(/\s+/g, "") ||
      null,
  ]
    .filter(Boolean)
    .join("-");
