// Garment size ordering: small -> large.
// Letter sizes by rank, numeric sizes ascending, anything unknown goes last (alphabetical).
const LETTER_RANK = {
  "3XS": 1,
  XXXS: 1,
  "2XS": 2,
  XXS: 2,
  XS: 3,
  S: 4,
  M: 5,
  L: 6,
  XL: 7,
  "2XL": 8,
  XXL: 8,
  "3XL": 9,
  XXXL: 9,
  "4XL": 10,
  "5XL": 11,
  "6XL": 12,
  "7XL": 13,
};

const sizeKey = (size) => {
  const raw = String(size ?? "").trim().toUpperCase();
  if (!raw) return [3, 0, ""];

  // "S-LONG", "XL LONG" -> rank of base size, then suffix (regular before long)
  const [base, ...rest] = raw.split(/[\s-]+/);
  const suffix = rest.join(" ");
  if (LETTER_RANK[base] !== undefined) return [0, LETTER_RANK[base], suffix];

  // "42", "47/48", "N38" -> by first number found
  const num = raw.match(/\d+(\.\d+)?/);
  if (num) return [1, Number(num[0]), raw];

  return [2, 0, raw];
};

export const compareSizes = (a, b) => {
  const ka = sizeKey(a);
  const kb = sizeKey(b);
  for (let i = 0; i < 3; i++) {
    if (ka[i] < kb[i]) return -1;
    if (ka[i] > kb[i]) return 1;
  }
  return 0;
};

export const sortBySize = (items, getSize = (x) => x) =>
  [...items].sort((a, b) => compareSizes(getSize(a), getSize(b)));
