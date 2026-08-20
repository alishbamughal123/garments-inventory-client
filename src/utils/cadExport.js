import bwipjs from "bwip-js";

/**
 * Parses SVG output from bwipjs into bar rectangle coordinates.
 * Each bar has { x, y, width, height } in SVG coordinate space.
 */
const parseBarcodeBars = (svgString) => {
  const bars = [];
  const pathRegex = /<path\s+[^>]*stroke-width="([^"]+)"[^>]*d="([^"]+)"[^>]*>/gi;
  let match;

  while ((match = pathRegex.exec(svgString)) !== null) {
    const strokeWidth = parseFloat(match[1]);
    const d = match[2];

    const lineRegex = /M\s*([\d.]+)\s+([\d.]+)\s*L\s*([\d.]+)\s+([\d.]+)/gi;
    let lineMatch;

    while ((lineMatch = lineRegex.exec(d)) !== null) {
      const x1 = parseFloat(lineMatch[1]);
      const y1 = parseFloat(lineMatch[2]);
      const y2 = parseFloat(lineMatch[4]);

      const topY = Math.min(y1, y2);
      const height = Math.abs(y2 - y1);
      const leftX = x1 - strokeWidth / 2;

      bars.push({
        x: leftX,
        y: topY,
        width: strokeWidth,
        height: height,
      });
    }
  }

  const viewBoxMatch = svgString.match(/viewBox="([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)"/i);
  let vbWidth = 300;
  let vbHeight = 60;
  if (viewBoxMatch) {
    vbWidth = parseFloat(viewBoxMatch[3]);
    vbHeight = parseFloat(viewBoxMatch[4]);
  }

  return { bars, vbWidth, vbHeight };
};

/**
 * Generates an AutoCAD R12 compatible DXF file string.
 * All text and barcodes are strictly bounded within the RED border with 4mm safe margins.
 */
export const generateGarmentLabelsDXF = (products = []) => {
  if (!products || products.length === 0) return "";

  const isSingle = products.length === 1;

  // Label physical specs in Millimeters (mm) - Generous 80mm x 50mm
  const labelWidth = 80; // 80mm wide
  const labelHeight = 50; // 50mm high
  const gapX = isSingle ? 0 : 12;
  const gapY = isSingle ? 0 : 12;
  const cols = isSingle ? 1 : 3;

  let entitiesDXF = "";

  products.forEach((product, index) => {
    const colIndex = index % cols;
    const rowIndex = Math.floor(index / cols);

    const originX = colIndex * (labelWidth + gapX);
    const totalRows = Math.ceil(products.length / cols);
    const originY = (totalRows - 1 - rowIndex) * (labelHeight + gapY);

    const rawBarcodeVal =
      product.barcodes?.find((b) => b.isPrimary)?.barcodeValue ||
      product.barcodes?.[0]?.barcodeValue ||
      product.sku ||
      "N/A";

    const barcodeVal = String(rawBarcodeVal).trim();
    const brand = (product.brand || "NORDIC PROWEAR").toUpperCase().slice(0, 18);
    const styleNo = (product.styleNumber || product.baseStyleNumber || product.sku || "").toUpperCase().slice(0, 12);
    const name = (product.productName || product.styleName || "GARMENT").slice(0, 26).toUpperCase();
    const colorVal = (product.color || "STD").toUpperCase().slice(0, 12);
    const sizeVal = (product.size || "OS").toUpperCase().slice(0, 8);
    const specText = `COLOR: ${colorVal}  |  SIZE: ${sizeVal}`;
    const priceText = product.salePrice ? `NOK ${Number(product.salePrice).toFixed(2)}` : "";
    const skuText = `SKU: ${(product.sku || styleNo).slice(0, 16)}`;

    // 1. Draw RED Outer Cut Border (80mm x 50mm) on BORDER layer
    const x0 = originX;
    const y0 = originY;
    const x1 = originX + labelWidth;
    const y1 = originY + labelHeight;

    entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x0.toFixed(2)}\n20\n${y0.toFixed(2)}\n30\n0.0\n11\n${x1.toFixed(2)}\n21\n${y0.toFixed(2)}\n31\n0.0\n`;
    entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x1.toFixed(2)}\n20\n${y0.toFixed(2)}\n30\n0.0\n11\n${x1.toFixed(2)}\n21\n${y1.toFixed(2)}\n31\n0.0\n`;
    entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x1.toFixed(2)}\n20\n${y1.toFixed(2)}\n30\n0.0\n11\n${x0.toFixed(2)}\n21\n${y1.toFixed(2)}\n31\n0.0\n`;
    entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x0.toFixed(2)}\n20\n${y1.toFixed(2)}\n30\n0.0\n11\n${x0.toFixed(2)}\n21\n${y0.toFixed(2)}\n31\n0.0\n`;

    // 2. GREEN TEXT ANNOTATIONS (Strictly bounded with width factor 0.75):
    // Brand (Top Left: y0 + 44.5)
    entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 44.5).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\n${brand}\n`;
    
    // Style Number (Top Right: y0 + 44.5)
    entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 54).toFixed(2)}\n20\n${(originY + 44.5).toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\n#${styleNo}\n`;

    // Article Name (Line 2: y0 + 39.5)
    entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 39.5).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\n${name.slice(0, 22)}\n`;

    // Color & Size (Line 3: y0 + 34.5)
    entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 34.5).toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\n${specText.slice(0, 26)}\n`;

    // Inner Separator line (y0 + 32.5)
    const sepY = originY + 32.5;
    entitiesDXF += `0\nLINE\n8\nTEXT_INFO\n10\n${(originX + 4).toFixed(2)}\n20\n${sepY.toFixed(2)}\n30\n0.0\n11\n${(originX + labelWidth - 4).toFixed(2)}\n21\n${sepY.toFixed(2)}\n31\n0.0\n`;

    // 3. BARCODE BARS (Strictly centered at 56mm width -> originX + 12 to originX + 68)
    try {
      const svg = bwipjs.toSVG({
        bcid: "code128",
        text: String(barcodeVal),
        scale: 1,
        height: 12,
        includetext: false,
      });

      const { bars, vbWidth, vbHeight } = parseBarcodeBars(svg);

      const targetBarcodeWidth = 56; // 56mm wide (fits comfortably in 80mm)
      const targetBarcodeHeight = 15; // 15mm tall
      const barcodeOriginX = originX + (labelWidth - targetBarcodeWidth) / 2; // 12mm from left
      const barcodeOriginY = originY + 14;

      const scaleX = targetBarcodeWidth / (vbWidth || 1);
      const scaleY = targetBarcodeHeight / (vbHeight || 40);

      bars.forEach((bar) => {
        const bx1 = barcodeOriginX + bar.x * scaleX;
        const bx2 = bx1 + bar.width * scaleX;
        const by2 = barcodeOriginY + targetBarcodeHeight - bar.y * scaleY;
        const by1 = by2 - bar.height * scaleY;

        // 1. AutoCAD standard SOLID quad
        entitiesDXF += `0\nSOLID\n8\nBARCODE_BARS\n10\n${bx1.toFixed(3)}\n20\n${by1.toFixed(3)}\n30\n0.0\n11\n${bx2.toFixed(3)}\n21\n${by1.toFixed(3)}\n31\n0.0\n12\n${bx1.toFixed(3)}\n22\n${by2.toFixed(3)}\n32\n0.0\n13\n${bx2.toFixed(3)}\n23\n${by2.toFixed(3)}\n33\n0.0\n`;

        // 2. Dense vector fill lines (0.06mm step) for 100% solid contrast on Web CAD viewers (ShareCAD)
        for (let x = bx1; x <= bx2 + 0.01; x += 0.06) {
          entitiesDXF += `0\nLINE\n8\nBARCODE_BARS\n10\n${x.toFixed(3)}\n20\n${by1.toFixed(3)}\n30\n0.0\n11\n${x.toFixed(3)}\n21\n${by2.toFixed(3)}\n31\n0.0\n`;
        }
      });
    } catch (err) {
      console.warn("Could not generate barcode for DXF:", err);
    }

    // 4. Barcode Digits (Line 4: y0 + 8.5, Centered with width factor 0.75)
    const approxDigitWidth = barcodeVal.length * 1.2;
    const digitStartX = Math.max(originX + 6, originX + (labelWidth - approxDigitWidth) / 2);
    entitiesDXF += `0\nTEXT\n8\nBARCODE_DIGITS\n10\n${digitStartX.toFixed(2)}\n20\n${(originY + 8.5).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\n${barcodeVal}\n`;

    // 5. SKU (Bottom Left: y0 + 3.2) & Price (Bottom Right: y0 + 3.2)
    entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 3.2).toFixed(2)}\n30\n0.0\n40\n1.9\n41\n0.75\n1\n${skuText}\n`;
    if (priceText) {
      entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 54).toFixed(2)}\n20\n${(originY + 3.2).toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\n${priceText}\n`;
    }
  });

  // Assemble full standard AutoCAD R12 DXF file
  const dxfContent = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1009
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LTYPE
70
1
0
LTYPE
2
CONTINUOUS
70
0
3
Solid line
72
65
73
0
40
0.0
0
ENDTAB
0
TABLE
2
LAYER
70
4
0
LAYER
2
0
70
0
62
7
6
CONTINUOUS
0
LAYER
2
BORDER
70
0
62
1
6
CONTINUOUS
0
LAYER
2
BARCODE_BARS
70
0
62
7
6
CONTINUOUS
0
LAYER
2
TEXT_INFO
70
0
62
3
6
CONTINUOUS
0
LAYER
2
BARCODE_DIGITS
70
0
62
4
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
${entitiesDXF}0
ENDSEC
0
EOF
`;

  return dxfContent;
};

/**
 * Generates an Ultra-Crisp, High-Resolution, Non-Overlapping Vector CAD SVG file.
 * Perfectly bounded within the 80mm x 50mm label area.
 */
export const generateGarmentLabelsSVG = (products = []) => {
  if (!products || products.length === 0) return "";

  const isSingle = products.length === 1;

  const labelWidth = 80; // 80mm
  const labelHeight = 50; // 50mm
  const gap = isSingle ? 0 : 10;
  const cols = isSingle ? 1 : 3;
  const totalRows = Math.ceil(products.length / cols);

  const totalWidth = isSingle ? labelWidth : cols * (labelWidth + gap) + gap;
  const totalHeight = isSingle ? labelHeight : totalRows * (labelHeight + gap) + gap;

  let labelsSVG = "";

  products.forEach((product, index) => {
    const colIndex = index % cols;
    const rowIndex = Math.floor(index / cols);

    const x = isSingle ? 0 : gap + colIndex * (labelWidth + gap);
    const y = isSingle ? 0 : gap + rowIndex * (labelHeight + gap);

    const rawBarcodeVal =
      product.barcodes?.find((b) => b.isPrimary)?.barcodeValue ||
      product.barcodes?.[0]?.barcodeValue ||
      product.sku ||
      "N/A";

    const barcodeVal = String(rawBarcodeVal).trim();
    const brand = (product.brand || "NORDIC PROWEAR").toUpperCase().slice(0, 20);
    const styleNo = (product.styleNumber || product.baseStyleNumber || product.sku || "").toUpperCase().slice(0, 14);
    const name = (product.productName || product.styleName || "Garment Article").slice(0, 28);
    const color = (product.color || "Standard").slice(0, 14);
    const size = (product.size || "OS").slice(0, 8);
    const priceText = product.salePrice ? `NOK ${Number(product.salePrice).toFixed(2)}` : "";

    let barcodeBarsSVG = "";
    try {
      const rawSvg = bwipjs.toSVG({
        bcid: "code128",
        text: String(barcodeVal),
        scale: 1,
        height: 12,
        includetext: false,
      });

      const { bars, vbWidth, vbHeight } = parseBarcodeBars(rawSvg);
      const targetWidth = 58; // 58mm wide
      const targetHeight = 15; // 15mm high
      const scaleX = targetWidth / (vbWidth || 1);
      const scaleY = targetHeight / (vbHeight || 40);

      const barElements = bars
        .map(
          (b) =>
            `<rect x="${(b.x * scaleX).toFixed(3)}" y="${(b.y * scaleY).toFixed(3)}" width="${(b.width * scaleX).toFixed(3)}" height="${(b.height * scaleY).toFixed(3)}" fill="#0f172a" shape-rendering="crispEdges" />`
        )
        .join("");

      barcodeBarsSVG = `
        <g transform="translate(${(labelWidth - targetWidth) / 2}, 18.5)">
          ${barElements}
        </g>
      `;
    } catch {
      barcodeBarsSVG = `<text x="${labelWidth / 2}" y="26" text-anchor="middle" font-family="monospace" font-size="3" fill="#64748b">${barcodeVal}</text>`;
    }

    labelsSVG += `
      <g transform="translate(${x}, ${y})" class="garment-sticker">
        <!-- Label Outer Cut Border (80mm x 50mm) -->
        <rect x="0" y="0" width="${labelWidth}" height="${labelHeight}" rx="3" fill="#ffffff" stroke="#ef4444" stroke-width="0.6" />
        
        <!-- Header: Brand & Style -->
        <text x="4" y="5.8" font-family="Arial, Helvetica, sans-serif" font-size="2.6" font-weight="900" fill="#0f172a">${brand}</text>
        <rect x="${labelWidth - 25}" y="2.5" width="21" height="4.5" rx="1.5" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="0.3" />
        <text x="${labelWidth - 14.5}" y="5.7" text-anchor="middle" font-family="monospace" font-size="2.3" font-weight="bold" fill="#1e293b">#${styleNo}</text>
        
        <!-- Article Name -->
        <text x="4" y="10.8" font-family="Arial, Helvetica, sans-serif" font-size="3.0" font-weight="bold" fill="#1e293b">${name}</text>
        
        <!-- Color & Size Pill -->
        <rect x="4" y="12.6" width="${labelWidth - 8}" height="4.5" rx="1.5" fill="#f8fafc" stroke="#e2e8f0" stroke-width="0.3" />
        <text x="6.5" y="15.8" font-family="Arial, Helvetica, sans-serif" font-size="2.3" font-weight="600" fill="#475569">
          Color: <tspan font-weight="bold" fill="#0f172a">${color}</tspan>   •   Size: <tspan font-weight="bold" fill="#2563eb">${size}</tspan>
        </text>
        
        <!-- Barcode Graphic -->
        ${barcodeBarsSVG}
        
        <!-- Barcode Digits -->
        <text x="${labelWidth / 2}" y="38.5" text-anchor="middle" font-family="Consolas, monospace" font-size="3.2" font-weight="bold" letter-spacing="0.8" fill="#0f172a">${barcodeVal}</text>
        
        <!-- Divider -->
        <line x1="4" y1="42.5" x2="${labelWidth - 4}" y2="42.5" stroke="#e2e8f0" stroke-width="0.3" />
        
        <!-- Footer: SKU & Price -->
        <text x="4" y="46.8" font-family="monospace" font-size="2.2" fill="#64748b">SKU: ${(product.sku || styleNo).slice(0, 16)}</text>
        ${priceText ? `<text x="${labelWidth - 4}" y="46.8" text-anchor="end" font-family="Arial, sans-serif" font-size="2.5" font-weight="bold" fill="#059669">${priceText}</text>` : ""}
      </g>
    `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}mm" height="${totalHeight}mm" viewBox="0 0 ${totalWidth} ${totalHeight}">
  <style>
    .garment-sticker text { user-select: none; }
  </style>
  <rect width="100%" height="100%" fill="${isSingle ? "#ffffff" : "#f1f5f9"}" />
  ${labelsSVG}
</svg>`;
};

/**
 * Generates an AutoCAD R12 DXF file string specifically for the Master Carton Barcode Label.
 * Simple, clean, high-clarity 80mm x 50mm format matching garment label DXF standard.
 */
export const generateMixedCartonStickerDXF = ({
  orderNo = "NP10002",
  cartonNo = "Z15",
  styleNo = "STYLE",
  styleName = "Apparel",
  color = "Standard",
  totalQty = 0,
  items = [],
  masterBarcodeVal = "",
}) => {
  // Exact 80mm x 50mm standard matching garment labels DXF
  const labelWidth = 80;
  const labelHeight = 50;
  const originX = 0;
  const originY = 0;

  const cleanOrder = String(orderNo || "ORD").replace(/[^a-zA-Z0-9]/g, "").slice(0, 7);
  const cleanCarton = String(cartonNo || "Z15").split(/[\(\s]/)[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 5);
  const cleanColor = (color.length <= 4 ? color : color.slice(0, 4)).toUpperCase().replace(/[^a-zA-Z0-9]/g, "") || "CLR";
  const cleanStyle = String(styleNo || "STY").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6);

  const barcodeVal = String(
    masterBarcodeVal || `CTN-${cleanOrder}-${cleanCarton}-${cleanStyle}-${cleanColor}`
  ).trim();

  const brand = "NORDIC PROWEAR";
  const styleText = `#${cleanStyle}`;
  const line2Text = `CARTON: ${cleanCarton}  |  ORDER: ${cleanOrder}`;
  const line3Text = `COLOR: ${cleanColor}  |  TOTAL: ${totalQty} PCS (MIX)`;
  const skuText = `SKU: ${cleanStyle}-${cleanColor}-MIX`;
  const tagText = "LAST BOX (MIX)";

  let entitiesDXF = "";

  // 1. Draw RED Outer Cut Border (80mm x 50mm) on BORDER layer
  const x0 = originX;
  const y0 = originY;
  const x1 = originX + labelWidth;
  const y1 = originY + labelHeight;

  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x0.toFixed(2)}\n20\n${y0.toFixed(2)}\n30\n0.0\n11\n${x1.toFixed(2)}\n21\n${y0.toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x1.toFixed(2)}\n20\n${y0.toFixed(2)}\n30\n0.0\n11\n${x1.toFixed(2)}\n21\n${y1.toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x1.toFixed(2)}\n20\n${y1.toFixed(2)}\n30\n0.0\n11\n${x0.toFixed(2)}\n21\n${y1.toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x0.toFixed(2)}\n20\n${y1.toFixed(2)}\n30\n0.0\n11\n${x0.toFixed(2)}\n21\n${y0.toFixed(2)}\n31\n0.0\n`;

  // 2. GREEN TEXT ANNOTATIONS (Strictly inside [originX + 4, originX + 76]):
  // Brand (Top Left: y0 + 44.5)
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 44.5).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\n${brand}\n`;

  // Style Number (Top Right: y0 + 44.5)
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 54).toFixed(2)}\n20\n${(originY + 44.5).toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\n${styleText}\n`;

  // Line 2 (Carton & Order: y0 + 39.5)
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 39.5).toFixed(2)}\n30\n0.0\n40\n2.1\n41\n0.75\n1\n${line2Text.slice(0, 32)}\n`;

  // Line 3 (Color & Qty: y0 + 34.5)
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 34.5).toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\n${line3Text.slice(0, 32)}\n`;

  // Inner Separator line (y0 + 32.5)
  const sepY = originY + 32.5;
  entitiesDXF += `0\nLINE\n8\nTEXT_INFO\n10\n${(originX + 4).toFixed(2)}\n20\n${sepY.toFixed(2)}\n30\n0.0\n11\n${(originX + labelWidth - 4).toFixed(2)}\n21\n${sepY.toFixed(2)}\n31\n0.0\n`;

  // 3. BARCODE BARS (Strictly centered at 56mm width -> originX + 12 to originX + 68)
  try {
    const svg = bwipjs.toSVG({
      bcid: "code128",
      text: String(barcodeVal),
      scale: 1,
      height: 12,
      includetext: false,
    });

    const { bars, vbWidth, vbHeight } = parseBarcodeBars(svg);

    const targetBarcodeWidth = 56; // 56mm wide (fits comfortably in 80mm)
    const targetBarcodeHeight = 15; // 15mm tall
    const barcodeOriginX = originX + (labelWidth - targetBarcodeWidth) / 2; // 12mm from left
    const barcodeOriginY = originY + 14;

    const scaleX = targetBarcodeWidth / (vbWidth || 1);
    const scaleY = targetBarcodeHeight / (vbHeight || 40);

    bars.forEach((bar) => {
      const bx1 = barcodeOriginX + bar.x * scaleX;
      const bx2 = bx1 + bar.width * scaleX;
      const by2 = barcodeOriginY + targetBarcodeHeight - bar.y * scaleY;
      const by1 = by2 - bar.height * scaleY;

      // 1. AutoCAD standard SOLID quad
      entitiesDXF += `0\nSOLID\n8\nBARCODE_BARS\n10\n${bx1.toFixed(3)}\n20\n${by1.toFixed(3)}\n30\n0.0\n11\n${bx2.toFixed(3)}\n21\n${by1.toFixed(3)}\n31\n0.0\n12\n${bx1.toFixed(3)}\n22\n${by2.toFixed(3)}\n32\n0.0\n13\n${bx2.toFixed(3)}\n23\n${by2.toFixed(3)}\n33\n0.0\n`;

      // 2. Dense vector fill lines (0.06mm step) for 100% solid contrast on Web CAD viewers (ShareCAD)
      for (let x = bx1; x <= bx2 + 0.01; x += 0.06) {
        entitiesDXF += `0\nLINE\n8\nBARCODE_BARS\n10\n${x.toFixed(3)}\n20\n${by1.toFixed(3)}\n30\n0.0\n11\n${x.toFixed(3)}\n21\n${by2.toFixed(3)}\n31\n0.0\n`;
      }
    });
  } catch (err) {
    console.warn("Could not generate master carton barcode for DXF:", err);
  }

  // 4. Barcode Digits (Line 4: y0 + 8.5, Centered)
  const approxDigitWidth = barcodeVal.length * 1.2;
  const digitStartX = Math.max(originX + 6, originX + (labelWidth - approxDigitWidth) / 2);
  entitiesDXF += `0\nTEXT\n8\nBARCODE_DIGITS\n10\n${digitStartX.toFixed(2)}\n20\n${(originY + 8.5).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\n${barcodeVal}\n`;

  // 5. SKU (Bottom Left: y0 + 3.2) & Tag (Bottom Right: y0 + 3.2)
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 3.2).toFixed(2)}\n30\n0.0\n40\n1.9\n41\n0.75\n1\n${skuText}\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 50).toFixed(2)}\n20\n${(originY + 3.2).toFixed(2)}\n30\n0.0\n40\n1.9\n41\n0.75\n1\n${tagText}\n`;

  // Assemble full standard AutoCAD R12 DXF file
  const dxfContent = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1009
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LTYPE
70
1
0
LTYPE
2
CONTINUOUS
70
0
3
Solid line
72
65
73
0
40
0.0
0
ENDTAB
0
TABLE
2
LAYER
70
4
0
LAYER
2
BORDER
70
0
62
1
6
CONTINUOUS
0
LAYER
2
TEXT_INFO
70
0
62
3
6
CONTINUOUS
0
LAYER
2
BARCODE_BARS
70
0
62
7
6
CONTINUOUS
0
LAYER
2
BARCODE_DIGITS
70
0
62
4
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
${entitiesDXF}0
ENDSEC
0
EOF`;

  return dxfContent;
};

/**
 * Triggers download of the Mixed Carton Sticker AutoCAD DXF file.
 */
export const downloadMixedCartonCAD_DXF = ({
  orderNo = "NP10002",
  cartonNo = "Z15",
  styleNo = "STYLE",
  styleName = "Apparel",
  color = "Standard",
  totalQty = 0,
  items = [],
  masterBarcodeVal = "",
  fileName = "",
}) => {
  const dxfString = generateMixedCartonStickerDXF({
    orderNo,
    cartonNo,
    styleNo,
    styleName,
    color,
    totalQty,
    items,
    masterBarcodeVal,
  });

  const blob = new Blob([dxfString], { type: "application/dxf;charset=utf-8" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  const name = fileName || `Mixed_Carton_Sticker_${styleNo}_${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  a.download = `${name}_${new Date().toISOString().slice(0, 10)}.dxf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Triggers in-browser download of AutoCAD DXF (.dxf) file for standard garment labels.
 */
export const downloadCAD_DXF = ({ products = [], fileName = "Garment_Barcodes_CAD" }) => {
  const dxfString = generateGarmentLabelsDXF(products);
  if (!dxfString) throw new Error("No products available to generate CAD file.");

  const blob = new Blob([dxfString], { type: "application/dxf;charset=utf-8" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.dxf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Triggers in-browser download of Vector CAD (.svg) file.
 */
export const downloadCAD_SVG = ({ products = [], fileName = "Garment_Barcodes_Vector_CAD" }) => {
  const svgString = generateGarmentLabelsSVG(products);
  if (!svgString) throw new Error("No products available to generate SVG CAD file.");

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
};

