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

  // Style #200126 (Arendal - Classic trousers w elastic men)
  if (baseStyle === "200126" || baseStyle.startsWith("200126")) {
    return "/images/200126.png";
  }

  // Style #10114 (Århus - Chef Hat / Kokkehatt)
  if (baseStyle === "10114" || baseStyle.startsWith("10114")) {
    if (col.includes("black") || col.includes("sort") || col === "b") {
      return "/images/10114-black.png";
    }
    return "/images/10114-white.png";
  }

  // Style #20111 (Borås - Chef Jakke)
  if (baseStyle === "20111" || baseStyle.startsWith("20111")) {
    if (col.includes("white") || col.includes("hvit") || col === "w") {
      return "/images/20111-white.png";
    }
    return "/images/20111-black.png";
  }

  // Style #200127 (Haugesund - Slip trousers unisex)
  if (baseStyle === "200127" || baseStyle.startsWith("200127")) {
    return "/images/200127.png";
  }

  // Style #10115 (København - Apron / Forkle)
  if (baseStyle === "10115" || baseStyle.startsWith("10115")) {
    if (col.includes("grey") || col.includes("gray") || col.includes("grå") || col === "lg") {
      return "/images/10115-grey.png";
    }
    if (col.includes("navy") || col.includes("marine") || col === "n" || col === "nb") {
      return "/images/10115-navy.png";
    }
    return "/images/10115-black.png";
  }

  // Style #200128 (Mandal - Half apron)
  if (baseStyle === "200128" || baseStyle.startsWith("200128")) {
    if (col.includes("grey") || col.includes("gray") || col.includes("grå") || col === "lg") {
      return "/images/200128-grey.png";
    }
    if (col.includes("navy") || col.includes("marine") || col === "mn" || col === "n" || col === "nb") {
      return "/images/200128-navy.png";
    }
    return "/images/200128-black.png";
  }

  // Style #10103 (Molde - Pen skjorte)
  if (baseStyle === "10103" || baseStyle.startsWith("10103")) {
    if (col.includes("black") || col.includes("sort") || col === "b") {
      return "/images/10103-black.png";
    }
    return "/images/10103-white.png";
  }

  // Style #10107 (Hamar - Healthcare bukse NS 3357)
  if (baseStyle === "10107" || baseStyle.startsWith("10107")) {
    if (col.includes("navy") || col.includes("marine") || col === "n" || col === "nb") return "/images/10107-navy.png";
    if (col.includes("grey") || col.includes("gray") || col.includes("grå") || col === "g") return "/images/10107-grey.png";
    if (col.includes("black") || col.includes("sort") || col === "b") return "/images/10107-black.png";
    if (col.includes("green") || col.includes("grønn") || col === "gr") return "/images/10107-green.png";
    if (col.includes("light") || col.includes("lys") || col.includes("blue") || col.includes("blå") || col === "lb") return "/images/10107-lightblue.png";
    return "/images/10107-white.png";
  }

  // Style #10105 (Lillehammer - Scrubs Unisex NS 3361)
  if (baseStyle === "10105" || baseStyle.startsWith("10105")) {
    if (col.includes("navy") || col.includes("marine") || col === "n" || col === "nb") return "/images/10105-navy.png";
    if (col.includes("grey") || col.includes("gray") || col.includes("grå") || col === "g") return "/images/10105-grey.png";
    if (col.includes("black") || col.includes("sort") || col === "b") return "/images/10105-black.png";
    if (col.includes("green") || col.includes("grønn") || col === "gr") return "/images/10105-green.png";
    if (col.includes("light") || col.includes("lys") || col.includes("blue") || col.includes("blå") || col === "lb") return "/images/10105-lightblue.png";
    return "/images/10105-white.png";
  }

  // Style #10108 (Bergen - Healthcare bukse NS 3357)
  if (baseStyle === "10108" || baseStyle.startsWith("10108")) {
    if (col.includes("white") || col.includes("hvit") || col === "w") return "/images/10108-white.png";
    if (col.includes("grey") || col.includes("gray") || col.includes("grå") || col === "g") return "/images/10108-grey.png";
    if (col.includes("black") || col.includes("sort") || col === "b") return "/images/10108-black.png";
    if (col.includes("green") || col.includes("grønn") || col === "gr") return "/images/10108-green.png";
    if (col.includes("light") || col.includes("lys") || col.includes("blue") || col.includes("blå") || col === "lb") return "/images/10108-lightblue.png";
    return "/images/10108-navy.png";
  }

  // Style #10106 (Stavanger - Scrub overdel NS 3361)
  if (baseStyle === "10106" || baseStyle.startsWith("10106")) {
    if (col.includes("white") || col.includes("hvit") || col === "w") return "/images/10106-white.png";
    if (col.includes("grey") || col.includes("gray") || col.includes("grå") || col === "g") return "/images/10106-grey.png";
    if (col.includes("black") || col.includes("sort") || col === "b") return "/images/10106-black.png";
    if (col.includes("green") || col.includes("grønn") || col === "gr") return "/images/10106-green.png";
    if (col.includes("light") || col.includes("lys") || col.includes("blue") || col.includes("blå") || col === "lb") return "/images/10106-lightblue.png";
    return "/images/10106-navy.png";
  }

  // Style #200122 (Skagen - Striped Chef Trousers Men)
  if (baseStyle === "200122" || baseStyle.startsWith("200122")) {
    return "/images/200122.png";
  }

  // Style #20110 (Stockholm - Chef Jacket)
  if (baseStyle === "20110" || baseStyle.startsWith("20110")) {
    if (col.includes("black") || col.includes("sort") || col === "b") return "/images/20110-black.png";
    return "/images/20110-white.png";
  }

  // Style #10102 (Tønsberg - Polo Shirt)
  if (baseStyle === "10102" || baseStyle.startsWith("10102")) {
    if (col.includes("red") || col.includes("rød") || col === "r") return "/images/10102-red.png";
    if (col.includes("navy") || col.includes("marine") || col === "n" || col === "nb") return "/images/10102-navy.png";
    if (col.includes("white") || col.includes("hvit") || col === "w") return "/images/10102-white.png";
    return "/images/10102-black.png";
  }

  // Style #200125 (Umeå - Striped Chef Trousers Lady)
  if (baseStyle === "200125" || baseStyle.startsWith("200125")) {
    return "/images/200125.png";
  }

  // Style #200121 (Vejle - Houndstooth Check Chef Trousers Men)
  if (baseStyle === "200121" || baseStyle.startsWith("200121")) {
    return "/images/200121.png";
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

  if (baseStyle === "10102" || baseStyle.startsWith("10102")) {
    return "/images/washing-instructions10102.png";
  }

  if (baseStyle === "10103" || baseStyle.startsWith("10103")) {
    return "/images/washing-instructions10103.png";
  }

  if (baseStyle === "10105" || baseStyle.startsWith("10105")) {
    return "/images/washing-instructions10105.png";
  }

  if (baseStyle === "10106" || baseStyle.startsWith("10106")) {
    return "/images/washing-instructions10106.png";
  }

  if (baseStyle === "10107" || baseStyle.startsWith("10107")) {
    return "/images/washing-instructions10107.png";
  }

  if (baseStyle === "10108" || baseStyle.startsWith("10108")) {
    return "/images/washing-instructions10108.png";
  }

  if (baseStyle === "10109" || baseStyle.startsWith("10109")) {
    return "/images/washing-instructions10109.png";
  }

  if (baseStyle === "10114" || baseStyle.startsWith("10114")) {
    return "/images/washing-instructions10114.png";
  }

  if (baseStyle === "10115" || baseStyle.startsWith("10115")) {
    return "/images/washing-instructions10115.png";
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

  if (baseStyle === "20110" || baseStyle.startsWith("20110")) {
    return "/images/washing-instructions20110.png";
  }

  if (baseStyle === "20111" || baseStyle.startsWith("20111")) {
    return "/images/washing-instructions20111.png";
  }

  if (baseStyle === "200121" || baseStyle.startsWith("200121")) {
    return "/images/washing-instructions200121.png";
  }

  if (baseStyle === "200122" || baseStyle.startsWith("200122")) {
    return "/images/washing-instructions200122.png";
  }

  if (baseStyle === "200123" || baseStyle.startsWith("200123")) {
    return "/images/washing-instructions200123.png";
  }

  if (baseStyle === "200124" || baseStyle.startsWith("200124")) {
    return "/images/washing-instructions200124.png";
  }

  if (baseStyle === "200125" || baseStyle.startsWith("200125")) {
    return "/images/washing-instructions200125.png";
  }

  if (baseStyle === "200126" || baseStyle.startsWith("200126")) {
    return "/images/washing-instructions200126.png";
  }

  if (baseStyle === "200127" || baseStyle.startsWith("200127")) {
    return "/images/washing-instructions200127.png";
  }

  if (baseStyle === "200128" || baseStyle.startsWith("200128")) {
    return "/images/washing-instructions200128.png";
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
