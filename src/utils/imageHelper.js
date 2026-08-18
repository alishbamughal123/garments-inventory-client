const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, "")
  : "http://localhost:8000";

/**
 * Returns a color HEX code for apparel colors
 */
export const getColorHex = (colorName = "") => {
  const c = colorName.toLowerCase().trim();
  if (c.includes("pepita") || c.includes("papi") || c === "bp" || c === "bwp") return "#334155";
  if (c.includes("stripe") || c.includes("stri") || c === "bws") return "#475569";
  if (c.includes("white")) return "#f8fafc";
  if (c.includes("black")) return "#0f172a";
  if (c.includes("navy")) return "#1e3a8a";
  if (c.includes("grey") || c.includes("gray")) return "#64748b";
  if (c.includes("red")) return "#dc2626";
  if (c.includes("blue")) return "#2563eb";
  if (c.includes("green")) return "#16a34a";
  if (c.includes("yellow")) return "#eab308";
  if (c.includes("orange")) return "#ea580c";
  return "#94a3b8";
};

/**
 * Resolves product garment image URL cleanly with color-specific variants
 * Guarantees zero-flicker instant loading by prioritizing optimized local client assets
 */
export const resolveProductImageUrl = (imageUrl, baseStyleNumber = "", colorName = "") => {
  const baseStyle = String(baseStyleNumber || "").trim();
  const col = String(colorName || "").toLowerCase().trim();

  // 1. Check style-specific color variants first for guaranteed crisp instant rendering
  // Style #10099 (Nordic Mopp 60)
  if (baseStyle === "10099" || baseStyle.startsWith("10099")) {
    return "/images/10099.png";
  }

  // Style #200124 (Piteå - Kokkebukse pepita dame)
  if (baseStyle === "200124" || baseStyle.startsWith("200124")) {
    if (col.includes("white") && !col.includes("black") && !col.includes("pepita") && !col.includes("papi") && col !== "bp" && col !== "bwp") {
      return "/images/200124-white.png";
    }
    if (col.includes("black") && !col.includes("white") && !col.includes("pepita") && !col.includes("papi") && col !== "bp" && col !== "bwp") {
      return "/images/200124-black.png";
    }
    if (col.includes("navy")) {
      return "/images/200124-navy.png";
    }
    return "/images/200124.png";
  }

  // Style #10101 (Basic S/S Tee)
  if (baseStyle === "10101" || baseStyle.startsWith("10101")) {
    if (col.includes("white")) return "/images/10101-white.png";
    if (col.includes("navy")) return "/images/10101-navy.png";
    return "/images/10101-black.png";
  }

  // Style #10121 (Drammen - Sweat shirt)
  if (baseStyle === "10121" || baseStyle.startsWith("10121")) {
    if (col.includes("navy") || col.includes("marine") || col === "n" || col === "nb") {
      return "/images/10121-navy.png";
    }
    if (col.includes("red") || col.includes("rød") || col === "r") {
      return "/images/10121-red.png";
    }
    if (col.includes("white") || col.includes("hvit") || col === "w") {
      return "/images/10121-white.png";
    }
    if (col.includes("grey") || col.includes("gray") || col.includes("grå") || col === "lg" || col === "g") {
      return "/images/10121-grey.png";
    }
    return "/images/10121.png";
  }

  // Style #10123 (Bodø - Softshell Jakke)
  if (baseStyle === "10123" || baseStyle.startsWith("10123")) {
    if (col.includes("navy") || col.includes("marine") || col === "n" || col === "nb") {
      return "/images/10123-navy.png";
    }
    if (col.includes("grey") || col.includes("gray") || col.includes("grå") || col === "g") {
      return "/images/10123-grey.png";
    }
    return "/images/10123.png";
  }

  // Style #10109 (Ålesund - Coat / Arbeidsfrakk)
  if (baseStyle === "10109" || baseStyle.startsWith("10109")) {
    return "/images/10109.png";
  }

  // Style #10122 (Kalmar - Fleecejakke)
  if (baseStyle === "10122" || baseStyle.startsWith("10122")) {
    if (col.includes("navy") || col.includes("marine") || col === "n" || col === "nb") {
      return "/images/10122-navy.png";
    }
    if (col.includes("red") || col.includes("rød") || col === "r") {
      return "/images/10122-red.png";
    }
    return "/images/10122.png";
  }

  // Style #200123 (Åre - Service Trousers for Ladies)
  if (baseStyle === "200123" || baseStyle.startsWith("200123")) {
    if (col.includes("white") || col.includes("hvit") || col === "wh" || col === "w") {
      return "/images/200123-white.png";
    }
    return "/images/200123-black.png";
  }

  // Style #10124 (Oslo - Workwear Trousers)
  if (baseStyle === "10124" || baseStyle.startsWith("10124")) {
    return "/images/10124.png";
  }

  // 2. Process generic imageUrl if provided
  if (imageUrl) {
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("/images/")) {
      return imageUrl;
    }
    // Direct mapping from /uploads/articles to /images
    if (imageUrl.startsWith("/uploads/articles/")) {
      const filename = imageUrl.replace("/uploads/articles/", "");
      return `/images/${filename}`;
    }
    if (imageUrl.startsWith("/uploads/")) {
      return imageUrl;
    }
    return imageUrl;
  }

  return "/uploads/placeholders/default-article.svg";
};

/**
 * Resolves washing instruction image URL cleanly with Norwegian care label support
 */
export const resolveWashingImageUrl = (washingImageUrl, baseStyleNumber = "") => {
  const baseStyle = String(baseStyleNumber || "").trim();

  // 1. Built-in washing instruction image mappings first
  if (baseStyle === "10099" || baseStyle.startsWith("10099")) {
    return "/images/washing-instructions10099.png";
  }

  if (baseStyle === "10109" || baseStyle.startsWith("10109")) {
    return "/images/washing-instructions10109.png";
  }

  if (baseStyle === "10121" || baseStyle.startsWith("10121")) {
    return "/images/washing-instructions10121.png";
  }

  if (baseStyle === "10122" || baseStyle.startsWith("10122")) {
    return "/images/washing-instructions10122.png";
  }

  if (baseStyle === "10123" || baseStyle.startsWith("10123")) {
    return "/images/washing-instructions10123.png";
  }

  if (baseStyle === "200123" || baseStyle.startsWith("200123")) {
    return "/images/washing-instructions200123.png";
  }

  if (baseStyle === "200124" || baseStyle.startsWith("200124")) {
    return "/images/washing-instructions200124.png";
  }

  if (baseStyle === "10101" || baseStyle.startsWith("10101")) {
    return "/images/washing-instructions10101.png";
  }

  if (baseStyle === "10124" || baseStyle.startsWith("10124")) {
    return "/images/washing-instructions10124.png";
  }

  // 2. Process custom washing image URL
  if (washingImageUrl) {
    if (washingImageUrl.startsWith("http://") || washingImageUrl.startsWith("https://") || washingImageUrl.startsWith("data:")) {
      return washingImageUrl;
    }
    if (washingImageUrl.startsWith("/images/")) {
      return washingImageUrl;
    }
    if (washingImageUrl.startsWith("/uploads/washing/")) {
      const filename = washingImageUrl.replace("/uploads/washing/", "");
      return `/images/${filename}`;
    }
    if (washingImageUrl.startsWith("/uploads/")) {
      return washingImageUrl;
    }
    return washingImageUrl;
  }

  return "/uploads/placeholders/default-washing.svg";
};
