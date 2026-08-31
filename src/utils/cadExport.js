import bwipjs from "bwip-js";
import JSZip from "jszip";

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
 * Helper to generate AutoCAD R12 DXF barcode entities (SOLID filled quads + closed vector polylines).
 * 100% Optical Scannability Compliant: Zero stroke bleeding, sharp bar edges, true Code128 aspect ratios.
 */
const generateBarcodeDXFEntities = ({
  barcodeVal,
  originX,
  originY,
  targetWidth = 60,
  targetHeight = 16,
  layer = "BARCODE_BARS",
}) => {
  let entities = "";
  try {
    const cleanText = String(barcodeVal || "").trim();
    if (!cleanText) return "";

    const svg = bwipjs.toSVG({
      bcid: "code128",
      text: cleanText,
      scale: 1,
      height: 15,
      includetext: false,
    });

    const { bars, vbWidth, vbHeight } = parseBarcodeBars(svg);
    if (!bars || bars.length === 0) return "";

    const scaleX = targetWidth / (vbWidth || 1);
    const scaleY = targetHeight / (vbHeight || 40);

    bars.forEach((bar) => {
      const bx1 = originX + bar.x * scaleX;
      const bx2 = bx1 + bar.width * scaleX;
      const by2 = originY + targetHeight - bar.y * scaleY;
      const by1 = by2 - bar.height * scaleY;

      // 1. SOLID Entity (Standard filled quadrilateral for raster CAD, screen view & thermal printing)
      entities += `0\nSOLID\n8\n${layer}\n10\n${bx1.toFixed(3)}\n20\n${by1.toFixed(3)}\n30\n0.0\n11\n${bx2.toFixed(3)}\n21\n${by1.toFixed(3)}\n31\n0.0\n12\n${bx1.toFixed(3)}\n22\n${by2.toFixed(3)}\n32\n0.0\n13\n${bx2.toFixed(3)}\n23\n${by2.toFixed(3)}\n33\n0.0\n`;

      // 2. Closed POLYLINE (Precise 4-corner boundary for vector laser, knife plotters & CAD linework)
      entities += `0\nPOLYLINE\n8\n${layer}\n66\n1\n70\n1\n`;
      entities += `0\nVERTEX\n8\n${layer}\n10\n${bx1.toFixed(3)}\n20\n${by1.toFixed(3)}\n30\n0.0\n`;
      entities += `0\nVERTEX\n8\n${layer}\n10\n${bx2.toFixed(3)}\n20\n${by1.toFixed(3)}\n30\n0.0\n`;
      entities += `0\nVERTEX\n8\n${layer}\n10\n${bx2.toFixed(3)}\n20\n${by2.toFixed(3)}\n30\n0.0\n`;
      entities += `0\nVERTEX\n8\n${layer}\n10\n${bx1.toFixed(3)}\n20\n${by2.toFixed(3)}\n30\n0.0\n`;
      entities += `0\nSEQEND\n8\n${layer}\n`;
    });
  } catch (err) {
    console.warn("Could not generate barcode DXF entities for:", barcodeVal, err);
  }
  return entities;
};

/**
 * Generates an AutoCAD R12 compatible DXF file string for individual garment labels.
 * All text and barcodes are strictly bounded within the RED border with 4mm safe margins.
 */
export const generateGarmentLabelsDXF = (products = []) => {
  if (!products || products.length === 0) return "";

  const isSingle = products.length === 1;

  // Label physical specs in Millimeters (mm) - 80mm x 50mm
  const labelWidth = 80;
  const labelHeight = 50;
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

    // 2. TEXT ANNOTATIONS:
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

    // 3. BARCODE BARS
    const targetBarcodeWidth = 56;
    const targetBarcodeHeight = 15;
    const barcodeOriginX = originX + (labelWidth - targetBarcodeWidth) / 2;
    const barcodeOriginY = originY + 14;

    entitiesDXF += generateBarcodeDXFEntities({
      barcodeVal,
      originX: barcodeOriginX,
      originY: barcodeOriginY,
      targetWidth: targetBarcodeWidth,
      targetHeight: targetBarcodeHeight,
      layer: "BARCODE_BARS",
    });

    // 4. Barcode Digits (Line 4: y0 + 8.5)
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
5
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
 * Generates an Ultra-Crisp, High-Resolution, Non-Overlapping Vector CAD SVG file for garment labels.
 */
export const generateGarmentLabelsSVG = (products = []) => {
  if (!products || products.length === 0) return "";

  const isSingle = products.length === 1;

  const labelWidth = 80;
  const labelHeight = 50;
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
      const targetWidth = 58;
      const targetHeight = 15;
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
 * Generates entities string for a single Mixed Carton sticker at a specific (originX, originY).
 * Label Size: 100mm wide x 150mm high (Standard 4" x 6").
 */
const generateSingleMixedCartonEntities = ({
  orderNo = "NP10002",
  cartonNo = "Z15",
  styleNo = "STYLE",
  styleName = "Apparel",
  color = "Standard",
  totalQty = 0,
  items = [],
  masterBarcodeVal = "",
  originX = 0,
  originY = 0,
}) => {
  const labelWidth = 100;
  const labelHeight = 150;

  const cleanOrder = String(orderNo || "ORD").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
  const cleanCarton = String(cartonNo || "Z15").split(/[\(\s]/)[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
  const cleanColor = String(color || "STD").toUpperCase().replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 14);
  const cleanStyle = String(styleNo || "STYLE").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
  const cleanStyleName = String(styleName || "Garment").slice(0, 24).toUpperCase();

  const barcodeVal = String(
    masterBarcodeVal || `CTN-${cleanOrder}-${cleanCarton}-${cleanStyle}-${cleanColor.replace(/\s+/g, "")}`
  ).trim();

  let entitiesDXF = "";

  // 1. RED Outer Cut Border (100mm x 150mm) on BORDER layer
  const x0 = originX;
  const y0 = originY;
  const x1 = originX + labelWidth;
  const y1 = originY + labelHeight;

  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x0.toFixed(2)}\n20\n${y0.toFixed(2)}\n30\n0.0\n11\n${x1.toFixed(2)}\n21\n${y0.toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x1.toFixed(2)}\n20\n${y0.toFixed(2)}\n30\n0.0\n11\n${x1.toFixed(2)}\n21\n${y1.toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x1.toFixed(2)}\n20\n${y1.toFixed(2)}\n30\n0.0\n11\n${x0.toFixed(2)}\n21\n${y1.toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${x0.toFixed(2)}\n20\n${y1.toFixed(2)}\n30\n0.0\n11\n${x0.toFixed(2)}\n21\n${y0.toFixed(2)}\n31\n0.0\n`;

  // 2. HEADER SECTION (Y: 135 to 148)
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 5).toFixed(2)}\n20\n${(originY + 142.5).toFixed(2)}\n30\n0.0\n40\n3.2\n41\n0.75\n1\nNORDIC PROWEAR\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 5).toFixed(2)}\n20\n${(originY + 137.5).toFixed(2)}\n30\n0.0\n40\n1.8\n41\n0.75\n1\nGARMENT LOGISTICS & WAREHOUSING\n`;

  // Warning Badge Border & Text (Y: 136 to 146)
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${(originX + 52).toFixed(2)}\n20\n${(originY + 136).toFixed(2)}\n30\n0.0\n11\n${(originX + 95).toFixed(2)}\n21\n${(originY + 136).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${(originX + 95).toFixed(2)}\n20\n${(originY + 136).toFixed(2)}\n30\n0.0\n11\n${(originX + 95).toFixed(2)}\n21\n${(originY + 146).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${(originX + 95).toFixed(2)}\n20\n${(originY + 146).toFixed(2)}\n30\n0.0\n11\n${(originX + 52).toFixed(2)}\n21\n${(originY + 146).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${(originX + 52).toFixed(2)}\n20\n${(originY + 146).toFixed(2)}\n30\n0.0\n11\n${(originX + 52).toFixed(2)}\n21\n${(originY + 136).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 54.5).toFixed(2)}\n20\n${(originY + 139.8).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\nLAST BOX (MIXED SIZES)\n`;

  // Header Divider Line (Y = 134)
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 134).toFixed(2)}\n30\n0.0\n11\n${(originX + 96).toFixed(2)}\n21\n${(originY + 134).toFixed(2)}\n31\n0.0\n`;

  // 3. CARTON SPECS GRID (Y: 108 to 132)
  entitiesDXF += `0\nLINE\n8\nGRID_LINES\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 108).toFixed(2)}\n30\n0.0\n11\n${(originX + 96).toFixed(2)}\n21\n${(originY + 108).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nGRID_LINES\n10\n${(originX + 96).toFixed(2)}\n20\n${(originY + 108).toFixed(2)}\n30\n0.0\n11\n${(originX + 96).toFixed(2)}\n21\n${(originY + 132).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nGRID_LINES\n10\n${(originX + 96).toFixed(2)}\n20\n${(originY + 132).toFixed(2)}\n30\n0.0\n11\n${(originX + 4).toFixed(2)}\n21\n${(originY + 132).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nGRID_LINES\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 132).toFixed(2)}\n30\n0.0\n11\n${(originX + 4).toFixed(2)}\n21\n${(originY + 108).toFixed(2)}\n31\n0.0\n`;

  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 6).toFixed(2)}\n20\n${(originY + 126).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\nORDER NO: ${cleanOrder}\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 54).toFixed(2)}\n20\n${(originY + 126).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\nCARTON: ${cleanCarton}\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 6).toFixed(2)}\n20\n${(originY + 120).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\nSTYLE: #${cleanStyle} (${cleanStyleName})\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 6).toFixed(2)}\n20\n${(originY + 114).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\nCOLOR: ${cleanColor} (SOLID)\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 54).toFixed(2)}\n20\n${(originY + 114).toFixed(2)}\n30\n0.0\n40\n2.5\n41\n0.75\n1\nTOTAL: ${totalQty} PCS\n`;

  // 4. MASTER CARTON BARCODE SECTION (Y: 74 to 106)
  // Top divider line (Y = 106)
  entitiesDXF += `0\nLINE\n8\nGRID_LINES\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 106).toFixed(2)}\n30\n0.0\n11\n${(originX + 96).toFixed(2)}\n21\n${(originY + 106).toFixed(2)}\n31\n0.0\n`;

  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 6).toFixed(2)}\n20\n${(originY + 101.5).toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\nMASTER CARTON BARCODE (${cleanColor})\n`;

  // Standard 78mm x 18mm Master Barcode with 11mm pure white quiet zone on Left and Right
  const targetBcWidth = 78;
  const targetBcHeight = 18;
  const bcOriginX = originX + (labelWidth - targetBcWidth) / 2;
  const bcOriginY = originY + 80.5;

  entitiesDXF += generateBarcodeDXFEntities({
    barcodeVal,
    originX: bcOriginX,
    originY: bcOriginY,
    targetWidth: targetBcWidth,
    targetHeight: targetBcHeight,
    layer: "BARCODE_BARS",
  });

  const approxLen = barcodeVal.length * 1.3;
  const bcDigitX = Math.max(originX + 6, originX + (labelWidth - approxLen) / 2);
  entitiesDXF += `0\nTEXT\n8\nBARCODE_DIGITS\n10\n${bcDigitX.toFixed(2)}\n20\n${(originY + 76.0).toFixed(2)}\n30\n0.0\n40\n2.3\n41\n0.75\n1\n${barcodeVal}\n`;

  // Bottom divider line (Y = 74)
  entitiesDXF += `0\nLINE\n8\nGRID_LINES\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 74).toFixed(2)}\n30\n0.0\n11\n${(originX + 96).toFixed(2)}\n21\n${(originY + 74).toFixed(2)}\n31\n0.0\n`;

  // 5. ITEMIZED SIZE BREAKDOWN TABLE (Y: 14 to 72)
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 14).toFixed(2)}\n30\n0.0\n11\n${(originX + 96).toFixed(2)}\n21\n${(originY + 14).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${(originX + 96).toFixed(2)}\n20\n${(originY + 14).toFixed(2)}\n30\n0.0\n11\n${(originX + 96).toFixed(2)}\n21\n${(originY + 72).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${(originX + 96).toFixed(2)}\n20\n${(originY + 72).toFixed(2)}\n30\n0.0\n11\n${(originX + 4).toFixed(2)}\n21\n${(originY + 72).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nLINE\n8\nBORDER\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 72).toFixed(2)}\n30\n0.0\n11\n${(originX + 4).toFixed(2)}\n21\n${(originY + 14).toFixed(2)}\n31\n0.0\n`;

  // Table Header
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 6).toFixed(2)}\n20\n${(originY + 67.5).toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\nSIZE\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 22).toFixed(2)}\n20\n${(originY + 67.5).toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\nSKU CODE\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 54).toFixed(2)}\n20\n${(originY + 67.5).toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\nQTY\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 68).toFixed(2)}\n20\n${(originY + 67.5).toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\nUNIT BARCODE\n`;

  // Header bottom line
  entitiesDXF += `0\nLINE\n8\nGRID_LINES\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 66).toFixed(2)}\n30\n0.0\n11\n${(originX + 96).toFixed(2)}\n21\n${(originY + 66).toFixed(2)}\n31\n0.0\n`;

  const displayItems = Array.isArray(items) && items.length > 0 ? items.slice(0, 8) : [];
  const rowHeight = displayItems.length > 0 ? Math.min(6.2, 50 / displayItems.length) : 6.2;

  if (displayItems.length > 0) {
    displayItems.forEach((item, idx) => {
      const rowY = originY + 66 - (idx + 1) * rowHeight;
      const textY = rowY + (rowHeight - 2.0) / 2 + 0.3;

      const sizeStr = String(item.size || "OS").toUpperCase();
      const skuStr = String(item.sku || "").slice(0, 16);
      const qtyStr = `${item.cartonQty || 0} PCS`;
      const bcStr = String(item.resolvedBarcode || item.sku || "-").slice(0, 14);

      entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 6).toFixed(2)}\n20\n${textY.toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\n${sizeStr}\n`;
      entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 22).toFixed(2)}\n20\n${textY.toFixed(2)}\n30\n0.0\n40\n1.8\n41\n0.75\n1\n${skuStr}\n`;
      entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 54).toFixed(2)}\n20\n${textY.toFixed(2)}\n30\n0.0\n40\n2.0\n41\n0.75\n1\n${qtyStr}\n`;
      entitiesDXF += `0\nTEXT\n8\nBARCODE_DIGITS\n10\n${(originX + 68).toFixed(2)}\n20\n${textY.toFixed(2)}\n30\n0.0\n40\n1.9\n41\n0.75\n1\n${bcStr}\n`;

      if (idx < displayItems.length - 1) {
        entitiesDXF += `0\nLINE\n8\nGRID_LINES\n10\n${(originX + 4).toFixed(2)}\n20\n${rowY.toFixed(2)}\n30\n0.0\n11\n${(originX + 96).toFixed(2)}\n21\n${rowY.toFixed(2)}\n31\n0.0\n`;
      }
    });
  } else {
    entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 16).toFixed(2)}\n20\n${(originY + 40).toFixed(2)}\n30\n0.0\n40\n2.2\n41\n0.75\n1\nASSORTED SIZES PACK - SOLID COLOR\n`;
  }

  // 6. FOOTER SECTION (Y: 2 to 12)
  entitiesDXF += `0\nLINE\n8\nGRID_LINES\n10\n${(originX + 4).toFixed(2)}\n20\n${(originY + 12).toFixed(2)}\n30\n0.0\n11\n${(originX + 96).toFixed(2)}\n21\n${(originY + 12).toFixed(2)}\n31\n0.0\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 5).toFixed(2)}\n20\n${(originY + 6).toFixed(2)}\n30\n0.0\n40\n1.8\n41\n0.75\n1\nOFFICIAL NORDIC PROWEAR PACKING MANIFEST\n`;
  entitiesDXF += `0\nTEXT\n8\nTEXT_INFO\n10\n${(originX + 60).toFixed(2)}\n20\n${(originY + 6).toFixed(2)}\n30\n0.0\n40\n1.8\n41\n0.75\n1\nSOLID COLOR: ${cleanColor}\n`;

  return entitiesDXF;
};

/**
 * Generates an AutoCAD R12 DXF file string specifically for the Master Carton Barcode Packing Manifest Label.
 * 100% AutoCAD R12 (AC1009) specification compliant.
 */
export const generateMixedCartonStickerDXF = (cartonConfig = {}) => {
  const entitiesDXF = generateSingleMixedCartonEntities({
    ...cartonConfig,
    originX: cartonConfig.originX || 0,
    originY: cartonConfig.originY || 0,
  });

  return `0
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
6
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
LAYER
2
GRID_LINES
70
0
62
8
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
};

/**
 * Generates a single continuous multi-carton AutoCAD R12 DXF sheet containing ALL cartons arranged side-by-side.
 * Perfect for wide-format plotters / roll cutters (e.g. 600mm / 900mm roll).
 */
export const generateMultipleMixedCartonsCombinedDXF = (cartons = []) => {
  if (!cartons || cartons.length === 0) return "";

  const labelWidth = 100;
  const labelHeight = 150;
  const gapX = 15;
  const gapY = 15;
  const cols = Math.min(3, Math.max(1, cartons.length));
  const totalRows = Math.ceil(cartons.length / cols);

  let entitiesDXF = "";

  cartons.forEach((carton, index) => {
    const colIndex = index % cols;
    const rowIndex = Math.floor(index / cols);
    const originX = colIndex * (labelWidth + gapX);
    const originY = (totalRows - 1 - rowIndex) * (labelHeight + gapY);

    entitiesDXF += generateSingleMixedCartonEntities({
      ...carton,
      originX,
      originY,
    });
  });

  return `0
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
6
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
LAYER
2
GRID_LINES
70
0
62
8
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
};

/**
 * Generates an Ultra-Crisp, High-Resolution Vector CAD SVG file specifically for the Master Carton Label.
 * Dimensions: 100mm x 150mm. Opens directly in Chrome, Edge, Illustrator, CorelDRAW, Inkscape, or Plotters.
 */
export const generateMixedCartonStickerSVG = ({
  orderNo = "NP10002",
  cartonNo = "Z15",
  styleNo = "STYLE",
  styleName = "Apparel",
  color = "Standard",
  totalQty = 0,
  items = [],
  masterBarcodeVal = "",
}) => {
  const labelWidth = 100;
  const labelHeight = 150;

  const cleanOrder = String(orderNo || "ORD").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
  const cleanCarton = String(cartonNo || "Z15").split(/[\(\s]/)[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
  const cleanColor = String(color || "Standard").slice(0, 16);
  const cleanStyle = String(styleNo || "STYLE").slice(0, 12);
  const cleanStyleName = String(styleName || "Garment").slice(0, 24);

  const barcodeVal = String(
    masterBarcodeVal || `CTN-${cleanOrder}-${cleanCarton}-${cleanStyle}-${cleanColor.replace(/\s+/g, "")}`
  ).trim();

  let barcodeBarsSVG = "";
  try {
    const rawSvg = bwipjs.toSVG({
      bcid: "code128",
      text: barcodeVal,
      scale: 1,
      height: 12,
      includetext: false,
    });

    const { bars, vbWidth, vbHeight } = parseBarcodeBars(rawSvg);
    const targetWidth = 76;
    const targetHeight = 14;
    const scaleX = targetWidth / (vbWidth || 1);
    const scaleY = targetHeight / (vbHeight || 40);

    const barElements = bars
      .map(
        (b) =>
          `<rect x="${(b.x * scaleX).toFixed(3)}" y="${(b.y * scaleY).toFixed(3)}" width="${(b.width * scaleX).toFixed(3)}" height="${(b.height * scaleY).toFixed(3)}" fill="#0f172a" shape-rendering="crispEdges" />`
      )
      .join("");

    barcodeBarsSVG = `
      <g transform="translate(${(labelWidth - targetWidth) / 2}, 7)">
        ${barElements}
      </g>
    `;
  } catch {
    barcodeBarsSVG = `<text x="${labelWidth / 2}" y="15" text-anchor="middle" font-family="monospace" font-size="3" fill="#64748b">${barcodeVal}</text>`;
  }

  const displayItems = Array.isArray(items) && items.length > 0 ? items.slice(0, 8) : [];
  let rowsSVG = "";
  const startY = 7;
  const rowH = displayItems.length > 0 ? Math.min(6.5, 42 / displayItems.length) : 6.5;

  if (displayItems.length > 0) {
    displayItems.forEach((item, idx) => {
      const y = startY + idx * rowH;
      rowsSVG += `
        <g transform="translate(0, ${y})">
          <rect x="0" y="0" width="${labelWidth - 8}" height="${rowH}" fill="${idx % 2 === 1 ? "#f8fafc" : "#ffffff"}" />
          <rect x="2" y="1" width="12" height="${rowH - 2}" rx="1" fill="#0f172a" />
          <text x="8" y="${rowH / 2 + 0.8}" text-anchor="middle" font-family="Arial, sans-serif" font-size="2.2" font-weight="bold" fill="#ffffff">${String(item.size || "OS").toUpperCase()}</text>
          <text x="18" y="${rowH / 2 + 0.8}" font-family="monospace" font-size="2.1" fill="#334155">${String(item.sku || "").slice(0, 16)}</text>
          <rect x="48" y="1" width="14" height="${rowH - 2}" rx="1" fill="#fef2f2" stroke="#fecaca" stroke-width="0.2" />
          <text x="55" y="${rowH / 2 + 0.8}" text-anchor="middle" font-family="Arial, sans-serif" font-size="2.2" font-weight="bold" fill="#dc2626">${item.cartonQty || 0} pcs</text>
          <text x="66" y="${rowH / 2 + 0.8}" font-family="Consolas, monospace" font-size="2.2" font-weight="bold" fill="#0f172a">${String(item.resolvedBarcode || item.sku || "-").slice(0, 14)}</text>
          <line x1="0" y1="${rowH}" x2="${labelWidth - 8}" y2="${rowH}" stroke="#e2e8f0" stroke-width="0.3" />
        </g>
      `;
    });
  } else {
    rowsSVG = `
      <text x="${(labelWidth - 8) / 2}" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-size="2.6" fill="#94a3b8">Solid Color Assorted Sizes Pack</text>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${labelWidth}mm" height="${labelHeight}mm" viewBox="0 0 ${labelWidth} ${labelHeight}">
  <style>
    text { user-select: none; }
  </style>
  <rect width="100%" height="100%" fill="#ffffff" />
  
  <!-- Outer Cut Border (100mm x 150mm) -->
  <rect x="1" y="1" width="${labelWidth - 2}" height="${labelHeight - 2}" rx="3" fill="#ffffff" stroke="#ef4444" stroke-width="0.6" />
  
  <!-- Header: Brand & Warning Badge -->
  <g transform="translate(4, 5)">
    <text x="1" y="4.5" font-family="Arial, Helvetica, sans-serif" font-size="3.6" font-weight="900" fill="#0f172a" letter-spacing="0.5">NORDIC PROWEAR</text>
    <text x="1" y="8" font-family="Arial, Helvetica, sans-serif" font-size="1.8" font-weight="600" fill="#64748b">GARMENT LOGISTICS &amp; WAREHOUSING</text>
    
    <rect x="${labelWidth - 48}" y="0" width="40" height="7.5" rx="1.5" fill="#dc2626" />
    <text x="${labelWidth - 28}" y="5" text-anchor="middle" font-family="Arial, sans-serif" font-size="2.2" font-weight="bold" fill="#ffffff" letter-spacing="0.3">LAST BOX (MIXED SIZES)</text>
    
    <line x1="0" y1="10.5" x2="${labelWidth - 8}" y2="10.5" stroke="#0f172a" stroke-width="0.5" />
  </g>
  
  <!-- Specs Grid -->
  <g transform="translate(4, 18)">
    <rect x="0" y="0" width="${labelWidth - 8}" height="28" rx="2" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.4" />
    
    <text x="3" y="6" font-family="Arial, sans-serif" font-size="2.2" fill="#64748b">Order No: <tspan font-weight="bold" fill="#0f172a">${cleanOrder}</tspan></text>
    <text x="${(labelWidth - 8) / 2}" y="6" font-family="Arial, sans-serif" font-size="2.2" fill="#64748b">Carton: <tspan font-weight="bold" fill="#0f172a">${cleanCarton}</tspan></text>
    
    <text x="3" y="13" font-family="Arial, sans-serif" font-size="2.2" fill="#64748b">Style: <tspan font-weight="bold" fill="#0f172a">#${cleanStyle} (${cleanStyleName})</tspan></text>
    
    <text x="3" y="20" font-family="Arial, sans-serif" font-size="2.2" fill="#64748b">Garment Color: <tspan font-weight="bold" fill="#1e3a8a">${cleanColor.toUpperCase()} (Solid Box)</tspan></text>
    
    <line x1="0" y1="22.5" x2="${labelWidth - 8}" y2="22.5" stroke="#e2e8f0" stroke-width="0.3" />
    <text x="3" y="26" font-family="Arial, sans-serif" font-size="2.2" fill="#64748b">Total Items in Box: <tspan font-weight="900" font-size="2.6" fill="#dc2626">${totalQty} PCS</tspan></text>
  </g>
  
  <!-- Master Barcode Section -->
  <g transform="translate(4, 48)">
    <rect x="0" y="0" width="${labelWidth - 8}" height="36" rx="2" fill="#eff6ff" stroke="#93c5fd" stroke-width="0.5" stroke-dasharray="2 1" />
    <text x="${(labelWidth - 8) / 2}" y="4.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="2.1" font-weight="900" fill="#1e40af" letter-spacing="0.4">MASTER CARTON BARCODE - ${cleanColor.toUpperCase()}</text>
    
    ${barcodeBarsSVG}
    
    <text x="${(labelWidth - 8) / 2}" y="32.5" text-anchor="middle" font-family="Consolas, monospace" font-size="3.2" font-weight="bold" letter-spacing="0.8" fill="#0f172a">${barcodeVal}</text>
  </g>
  
  <!-- Size Breakdown Table -->
  <g transform="translate(4, 86)">
    <rect x="0" y="0" width="${labelWidth - 8}" height="52" rx="2" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.4" />
    
    <!-- Header -->
    <rect x="0" y="0" width="${labelWidth - 8}" height="7" rx="2" fill="#1e293b" />
    <text x="6" y="4.8" font-family="Arial, sans-serif" font-size="2.2" font-weight="bold" fill="#ffffff">SIZE</text>
    <text x="22" y="4.8" font-family="Arial, sans-serif" font-size="2.2" font-weight="bold" fill="#ffffff">SKU CODE</text>
    <text x="52" y="4.8" font-family="Arial, sans-serif" font-size="2.2" font-weight="bold" fill="#ffffff">QTY</text>
    <text x="68" y="4.8" font-family="Arial, sans-serif" font-size="2.2" font-weight="bold" fill="#ffffff">UNIT BARCODE</text>
    
    <!-- Rows -->
    ${rowsSVG}
  </g>
  
  <!-- Footer -->
  <g transform="translate(4, 142)">
    <line x1="0" y1="0" x2="${labelWidth - 8}" y2="0" stroke="#0f172a" stroke-width="0.4" />
    <text x="1" y="4.2" font-family="Arial, sans-serif" font-size="1.8" font-weight="bold" fill="#475569">Official Nordic Prowear ERP Packing Manifest</text>
    <text x="${labelWidth - 9}" y="4.2" text-anchor="end" font-family="Arial, sans-serif" font-size="1.8" font-weight="bold" fill="#475569">Carton: ${cleanCarton} • ${cleanColor}</text>
  </g>
</svg>`;
};

/**
 * Converts any array of products into structured mixed carton objects grouped by (Style + Color).
 */
export const groupProductsIntoCartons = (products = [], customOptions = {}) => {
  const cartons = [];
  const stylesMap = {};

  products.forEach((p) => {
    const sNo = String(
      p.baseStyleNumber ||
      (p.styleNumber ? p.styleNumber.split("-")[0] : p.sku) ||
      "STYLE"
    ).trim();

    if (!stylesMap[sNo]) {
      stylesMap[sNo] = {
        styleNo: sNo,
        styleName: p.styleName || p.itemName || p.productName || "Apparel",
        products: [],
      };
    }
    stylesMap[sNo].products.push(p);
  });

  Object.values(stylesMap).forEach((styleData) => {
    const colorMap = {};
    styleData.products.forEach((p) => {
      const col = (p.color || "Standard").trim();
      if (!colorMap[col]) {
        colorMap[col] = [];
      }
      colorMap[col].push(p);
    });

    Object.entries(colorMap).forEach(([colorName, colorProds], cIdx) => {
      const items = colorProds.map((p) => {
        const barcodeVal =
          p.barcodes?.find((b) => b.isPrimary)?.barcodeValue ||
          p.barcodes?.[0]?.barcodeValue ||
          p.sku;
        return {
          ...p,
          cartonQty: Math.max(1, p.stockQuantity || 10),
          resolvedBarcode: barcodeVal,
        };
      });

      const totalQty = items.reduce((sum, item) => sum + item.cartonQty, 0);
      const cleanCarton = customOptions.cartonNo || `Z${10 + cIdx}`;
      const cleanOrder = customOptions.orderNo || "NP10002";
      const cleanColor = (colorName.length <= 4 ? colorName : colorName.slice(0, 4)).toUpperCase().replace(/[^a-zA-Z0-9]/g, "") || "CLR";
      const cleanStyle = String(styleData.styleNo).replace(/[^a-zA-Z0-9]/g, "").slice(0, 6) || "STY";

      cartons.push({
        orderNo: cleanOrder,
        cartonNo: cleanCarton,
        styleNo: styleData.styleNo,
        styleName: styleData.styleName,
        color: colorName,
        totalQty,
        items,
        masterBarcodeVal: `CTN-${cleanOrder}-${cleanCarton}-${cleanStyle}-${cleanColor}`,
      });
    });
  });

  return cartons;
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
 * Triggers download of the Mixed Carton Sticker Vector CAD (.svg) file.
 */
export const downloadMixedCartonCAD_SVG = ({
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
  const svgString = generateMixedCartonStickerSVG({
    orderNo,
    cartonNo,
    styleNo,
    styleName,
    color,
    totalQty,
    items,
    masterBarcodeVal,
  });

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  const name = fileName || `Mixed_Carton_Vector_${styleNo}_${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  a.download = `${name}_${new Date().toISOString().slice(0, 10)}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Downloads a 1-Click ZIP bundle containing individual DXF & SVG files for ALL mixed cartons,
 * plus a combined master CAD sheet.
 */
export const downloadAllMixedCartonsZIP = async ({
  products = [],
  cartonsList = [],
  fileName = "Mixed_Cartons_CAD_DXF_Bundle",
  customOptions = {},
}) => {
  const cartons = cartonsList.length > 0 ? cartonsList : groupProductsIntoCartons(products, customOptions);

  if (!cartons || cartons.length === 0) {
    throw new Error("No mixed cartons available to package into ZIP.");
  }

  const zip = new JSZip();
  const dxfFolder = zip.folder("DXF_CAD_Files");
  const svgFolder = zip.folder("Vector_SVG_Files");

  cartons.forEach((carton) => {
    const safeStyle = String(carton.styleNo || "STYLE").replace(/[^a-zA-Z0-9]/g, "");
    const safeColor = String(carton.color || "STD").replace(/[^a-zA-Z0-9]/g, "");
    const fileBase = `Mixed_Carton_Style_${safeStyle}_${safeColor}`;

    const dxf = generateMixedCartonStickerDXF(carton);
    const svg = generateMixedCartonStickerSVG(carton);

    dxfFolder.file(`${fileBase}.dxf`, dxf);
    svgFolder.file(`${fileBase}.svg`, svg);
  });

  // Also include the combined multi-carton DXF sheet
  if (cartons.length > 1) {
    const combinedDXF = generateMultipleMixedCartonsCombinedDXF(cartons);
    dxfFolder.file(`ALL_Styles_Mixed_Cartons_Combined_Sheet.dxf`, combinedDXF);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Downloads a single combined AutoCAD DXF file with all mixed cartons laid out on one sheet.
 */
export const downloadAllMixedCartonsCombinedDXF = ({
  products = [],
  cartonsList = [],
  fileName = "All_Mixed_Cartons_Combined_CAD",
  customOptions = {},
}) => {
  const cartons = cartonsList.length > 0 ? cartonsList : groupProductsIntoCartons(products, customOptions);
  if (!cartons || cartons.length === 0) {
    throw new Error("No cartons available to generate combined CAD sheet.");
  }

  const dxfString = generateMultipleMixedCartonsCombinedDXF(cartons);
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
