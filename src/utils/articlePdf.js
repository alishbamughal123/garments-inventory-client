import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import logoImg from "../assets/newlogo.png";
import { shouldShowMeasurementCode } from "./sizeChartLabel";

const LABELS = {
  en: {
    styleNo: "Style No",
    colour: "Colour",
    selectedSize: "Selected Size",
    sku: "SKU",
    primaryBarcode: "Primary Barcode",
    availableSizes: "Available Sizes",
    sizeChart: "Size Chart",
    measurement: "Measurement",
    tol: "Tol.",
    fullSpecs: "Full Article Specifications",
    page: "Page",
    of: "of",
    style: "Style",
    article: "Article",
    locale: "en-GB",
  },
  no: {
    styleNo: "Stilnr",
    colour: "Farge",
    selectedSize: "Valgt størrelse",
    sku: "SKU",
    primaryBarcode: "Hovedstrekkode",
    availableSizes: "Tilgjengelige størrelser",
    sizeChart: "Måleskjema",
    measurement: "Målepunkt",
    tol: "Tol.",
    fullSpecs: "Komplette artikkelspesifikasjoner",
    page: "Side",
    of: "av",
    style: "Stil",
    article: "Artikkel",
    locale: "nb-NO",
  },
};

const NAVY = [10, 56, 102];
const SLATE = [71, 85, 105];
const LIGHT = [241, 245, 249];

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve({
          data: canvas.toDataURL("image/jpeg", 0.92),
          w: img.naturalWidth,
          h: img.naturalHeight,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const fitInto = (w, h, maxW, maxH) => {
  const ratio = Math.min(maxW / w, maxH / h);
  return { w: w * ratio, h: h * ratio };
};

/**
 * Builds and downloads a formatted PDF for an article (style).
 * Intentionally omits purchase price and stock quantities.
 */
export const downloadArticlePdf = async ({
  baseStyleNo,
  title,
  brand = "Nordic Prowear",
  colorName,
  colorCode,
  activeVariant,
  barcodeValue,
  availableSizes = [],
  imageUrl,
  sizeChart,
  specs = [],
  careElementId = "washing-care-card",
  isNo = false,
}) => {
  const L = isNo ? LABELS.no : LABELS.en;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (needed) => {
    if (y + needed > pageH - 16) {
      doc.addPage();
      y = margin;
    }
  };

  const sectionTitle = (text) => {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(text, margin, y);
    doc.setDrawColor(...NAVY);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 1.8, pageW - margin, y + 1.8);
    y += 7;
  };

  // ---------- HEADER ----------
  const logo = await loadImage(logoImg);
  const logoSize = 26;
  if (logo) {
    doc.addImage(logo.data, "JPEG", margin, y, logoSize, logoSize);
  }
  const textX = margin + (logo ? logoSize + 6 : 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...SLATE);
  doc.text(String(brand).toUpperCase(), textX, y + 6);
  doc.setFontSize(17);
  doc.setTextColor(...NAVY);
  const titleLines = doc.splitTextToSize(String(title || L.article), pageW - margin - textX);
  doc.text(titleLines, textX, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...SLATE);
  doc.text(
    `${L.style} #${baseStyleNo}${colorName ? `  |  ${colorName}${colorCode ? ` (${colorCode})` : ""}` : ""}`,
    textX,
    y + 14 + titleLines.length * 6.5
  );
  y += logoSize + 6;

  // ---------- OVERVIEW: image + key details ----------
  const img = imageUrl ? await loadImage(imageUrl) : null;
  const boxW = 62;
  const boxH = 62;
  const overviewTop = y;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(...LIGHT);
  doc.roundedRect(margin, y, boxW, boxH, 2, 2, "FD");
  if (img) {
    const f = fitInto(img.w, img.h, boxW - 6, boxH - 6);
    doc.addImage(img.data, "JPEG", margin + (boxW - f.w) / 2, y + (boxH - f.h) / 2, f.w, f.h);
  }

  const detailsX = margin + boxW + 8;
  const detailsW = pageW - margin - detailsX;
  autoTable(doc, {
    startY: overviewTop,
    margin: { left: detailsX, right: margin },
    tableWidth: detailsW,
    theme: "plain",
    styles: { fontSize: 9, cellPadding: { top: 1.6, bottom: 1.6, left: 0, right: 2 }, textColor: [30, 41, 59] },
    columnStyles: { 0: { fontStyle: "bold", textColor: SLATE, cellWidth: 34 } },
    body: [
      [L.styleNo, baseStyleNo],
      [L.colour, colorName ? `${colorName}${colorCode ? ` (${colorCode})` : ""}` : "-"],
      [L.selectedSize, activeVariant?.size || "-"],
      [L.sku, activeVariant?.sku || "-"],
      [L.primaryBarcode, barcodeValue || "-"],
      [L.availableSizes, availableSizes.length ? availableSizes.join(", ") : "-"],
    ],
  });
  y = Math.max(overviewTop + boxH, doc.lastAutoTable.finalY) + 8;

  // ---------- SIZE CHART ----------
  if (sizeChart?.sizes?.length && sizeChart?.measurements?.length) {
    sectionTitle(`${L.sizeChart} - ${L.style} #${baseStyleNo} (cm)`);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: "grid",
      head: [[L.measurement, ...sizeChart.sizes.map((s) => s.label), L.tol]],
      body: sizeChart.measurements.map((row) => {
        const rowName = (isNo && row.norwegianName) || row.name || "";
        return [
        shouldShowMeasurementCode(row.code, row.name, rowName) ? `${row.code}  ${rowName}` : rowName || row.code,
        ...sizeChart.sizes.map((s) => row.values?.[s.key] ?? "-"),
        row.tolerance || "-",
      ];
      }),
      styles: { fontSize: 8, cellPadding: 1.8, halign: "center", valign: "middle", lineColor: [226, 232, 240] },
      headStyles: { fillColor: NAVY, textColor: 255, fontStyle: "bold" },
      columnStyles: { 0: { halign: "left", cellWidth: 52 } },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  // ---------- WASHING & CARE (captured from the on-screen card) ----------
  const careEl = document.getElementById(careElementId);
  if (careEl) {
    try {
      const canvas = await html2canvas(careEl, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const f = fitInto(canvas.width, canvas.height, contentW, pageH - margin * 2 - 16);
      ensureSpace(f.h + 4);
      doc.addImage(canvas.toDataURL("image/png"), "PNG", margin, y, f.w, f.h);
      y += f.h + 8;
    } catch (err) {
      console.error("Care card capture failed", err);
    }
  }

  // ---------- FULL ARTICLE SPECIFICATIONS ----------
  if (specs.length) {
    sectionTitle(L.fullSpecs);
    const rows = [];
    for (let i = 0; i < specs.length; i += 2) {
      const a = specs[i];
      const b = specs[i + 1];
      rows.push([a.label, String(a.value ?? "-"), b ? b.label : "", b ? String(b.value ?? "-") : ""]);
    }
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: "grid",
      body: rows,
      styles: { fontSize: 8.5, cellPadding: 2.2, lineColor: [226, 232, 240], textColor: [30, 41, 59] },
      columnStyles: {
        0: { fontStyle: "bold", fillColor: LIGHT, textColor: SLATE, cellWidth: 36 },
        1: { cellWidth: contentW / 2 - 36 },
        2: { fontStyle: "bold", fillColor: LIGHT, textColor: SLATE, cellWidth: 36 },
        3: { cellWidth: contentW / 2 - 36 },
      },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  // ---------- FOOTER ----------
  const pages = doc.getNumberOfPages();
  const stamp = new Date().toLocaleDateString(L.locale);
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`${brand} - ${L.style} #${baseStyleNo}`, margin, pageH - 8);
    doc.text(`${stamp}  |  ${L.page} ${i} ${L.of} ${pages}`, pageW - margin, pageH - 8, { align: "right" });
  }

  doc.save(`${L.article}_${baseStyleNo}${colorName ? `_${colorName}` : ""}.pdf`.replace(/\s+/g, "_"));
};
