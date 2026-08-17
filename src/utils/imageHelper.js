const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, "")
  : "http://localhost:8000";

/**
 * Returns a color HEX code for apparel colors
 */
export const getColorHex = (colorName = "") => {
  const c = colorName.toLowerCase().trim();
  if (c.includes("white")) return "#f8fafc";
  if (c.includes("black")) return "#0f172a";
  if (c.includes("navy")) return "#1e3a8a";
  if (c.includes("grey") || c.includes("gray")) return "#64748b";
  if (c.includes("red")) return "#dc2626";
  if (c.includes("blue")) return "#2563eb";
  if (c.includes("green")) return "#16a34a";
  if (c.includes("yellow")) return "#eab308";
  if (c.includes("orange")) return "#ea580c";
  if (c.includes("pepita")) return "#334155";
  if (c.includes("stripe")) return "#475569";
  return "#94a3b8";
};

/**
 * Resolves product garment image URL cleanly with color-specific variants
 */
export const resolveProductImageUrl = (imageUrl, baseStyleNumber = "", colorName = "") => {
  if (imageUrl) {
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("/images/")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("/uploads/")) {
      return `${BACKEND_URL}${imageUrl}`;
    }
    return imageUrl;
  }

  const baseStyle = String(baseStyleNumber || "").trim();
  const col = String(colorName || "").toLowerCase();

  // Style #10101 (Basic S/S Tee)
  if (baseStyle === "10101" || baseStyle.startsWith("10101")) {
    if (col.includes("white")) return "/images/10101-white.jpg";
    if (col.includes("navy")) return "/images/10101-navy.jpg";
    return "/images/10101-black.png";
  }

  // Style #10124 (Oslo - Workwear Trousers)
  if (baseStyle === "10124" || baseStyle.startsWith("10124")) {
    return "/images/10124.png";
  }

  return "/uploads/placeholders/default-article.svg";
};

/**
 * Resolves washing instruction image URL cleanly with Norwegian care label support
 */
export const resolveWashingImageUrl = (washingImageUrl, baseStyleNumber = "") => {
  if (washingImageUrl) {
    if (washingImageUrl.startsWith("http://") || washingImageUrl.startsWith("https://") || washingImageUrl.startsWith("data:")) {
      return washingImageUrl;
    }
    if (washingImageUrl.startsWith("/images/")) {
      return washingImageUrl;
    }
    if (washingImageUrl.startsWith("/uploads/")) {
      return `${BACKEND_URL}${washingImageUrl}`;
    }
    return washingImageUrl;
  }

  const baseStyle = String(baseStyleNumber || "").trim();

  // Built-in washing instruction image mappings
  if (baseStyle === "10101" || baseStyle.startsWith("10101")) {
    return "/images/washing-instructions10101.png";
  }

  if (baseStyle === "10124" || baseStyle.startsWith("10124")) {
    return "/images/washing-instructions10124.png";
  }

  return "/uploads/placeholders/default-washing.svg";
};
