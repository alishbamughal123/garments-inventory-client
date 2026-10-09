const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Measurement codes such as "WAISTBAND" or "HIP" just repeat the measurement name
// ("Waistband", "Hip"), so showing both reads like duplicated text. Short pattern
// codes (A, B, E, 1, 5 ...) are real diagram labels and are always kept.
export const shouldShowMeasurementCode = (code, ...names) => {
  const c = norm(code);
  if (!c) return false;
  if (c.length <= 2) return true;
  if (/^[A-Z_]+$/.test(String(code)) && c.length > 4) return false; // internal key
  return !names.some((n) => {
    const x = norm(n);
    return x === c || x.startsWith(c);
  });
};
