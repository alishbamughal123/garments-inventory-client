import ExcelJS from "exceljs";
import bwipjs from "bwip-js";

const API_BASE =
  import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes("railway")
    ? import.meta.env.VITE_API_URL
    : "https://garments-inventory-server.onrender.com/api/v1";

/**
 * Generate a PNG data URL for a given barcode value using bwip-js or fallback to server
 */
export const generateBarcodeImageBase64 = async (barcodeValue) => {
  if (!barcodeValue) return null;

  // Attempt 1: In-browser canvas rendering with bwip-js
  try {
    const canvas = document.createElement("canvas");
    bwipjs.toCanvas(canvas, {
      bcid: "code128",
      text: String(barcodeValue),
      scale: 3,
      height: 12,
      includetext: true,
      textxalign: "center",
      textsize: 9,
      paddingwidth: 4,
      paddingheight: 4,
      backgroundcolor: "FFFFFF",
    });
    const dataUrl = canvas.toDataURL("image/png");
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    return { base64Data, dataUrl };
  } catch (err) {
    console.warn("Client-side bwip-js generation error, falling back to server:", err);
  }

  // Attempt 2: Fetch PNG from server barcode endpoint
  try {
    const response = await fetch(`${API_BASE}/products/barcode/${encodeURIComponent(barcodeValue)}`);
    if (response.ok) {
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
          resolve({ base64Data, dataUrl });
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }
  } catch (err) {
    console.warn("Server barcode image fetch error:", err);
  }

  return null;
};

/**
 * Export products to an Excel file with high-res barcode images embedded in cells
 */
export const exportArticlesToExcelWithBarcodes = async ({
  products = [],
  fileName = "Articles_Barcodes_Report",
  sheetName = "Articles & Barcodes",
  onProgress = null,
}) => {
  if (!products || products.length === 0) {
    throw new Error("No articles available to export.");
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nordic Inventory Management System";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ showGridLines: true }],
  });

  // Define Columns
  worksheet.columns = [
    { header: "Style No / Code", key: "styleNumber", width: 18 },
    { header: "Article Name", key: "productName", width: 34 },
    { header: "Category", key: "category", width: 18 },
    { header: "Color", key: "color", width: 14 },
    { header: "Size", key: "size", width: 10 },
    { header: "SKU", key: "sku", width: 18 },
    { header: "Barcode No", key: "barcodeValue", width: 22 },
    { header: "Barcode Sticker (Image)", key: "barcodeImage", width: 26 },
    { header: "Stock Qty", key: "stockQuantity", width: 12 },
    { header: "Price (NOK)", key: "salePrice", width: 15 },
    { header: "Stock Status", key: "status", width: 14 },
  ];

  // Style Header Row (Row 1)
  const headerRow = worksheet.getRow(1);
  headerRow.height = 32;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E293B" }, // Slate-800
    };
    cell.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF334155" } },
      bottom: { style: "medium", color: { argb: "FF0F172A" } },
      left: { style: "thin", color: { argb: "FF334155" } },
      right: { style: "thin", color: { argb: "FF334155" } },
    };
  });

  const total = products.length;

  for (let i = 0; i < total; i++) {
    const p = products[i];
    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100), i + 1, total);
    }

    const primaryBarcode =
      p.barcodes?.find((b) => b.isPrimary) || p.barcodes?.[0] || {};
    const barcodeVal = primaryBarcode?.barcodeValue || p.sku || "";
    const isLowStock = (p.stockQuantity ?? 0) <= (p.minStockAlert ?? 5);

    const rowIndex = i + 2; // Data starts at row 2
    const row = worksheet.addRow({
      styleNumber: p.styleNumber || p.baseStyleNumber || p.sku || "-",
      productName: p.productName || p.styleName || "-",
      category: p.category?.name || p.category || "Apparel",
      color: p.color || "-",
      size: p.size || "-",
      sku: p.sku || "-",
      barcodeValue: barcodeVal || "-",
      barcodeImage: "", // Will hold embedded image
      stockQuantity: p.stockQuantity ?? 0,
      salePrice: p.salePrice ? Number(p.salePrice) : 0,
      status: isLowStock ? "Low Stock" : "In Stock",
    });

    row.height = 56; // Ample room for barcode image

    // Style data cells
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.font = { name: "Calibri", size: 10, color: { argb: "FF1E293B" } };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };

      // Left-align product name
      if (colNumber === 2) {
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };
      }

      // Format Price
      if (colNumber === 10) {
        cell.numFmt = '#,##0.00 "NOK"';
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF047857" } };
      }

      // Format Status
      if (colNumber === 11) {
        cell.font = {
          name: "Calibri",
          size: 10,
          bold: true,
          color: { argb: isLowStock ? "FFB45309" : "FF047857" },
        };
      }

      // Monospace feel for SKU & Barcode digits
      if (colNumber === 1 || colNumber === 6 || colNumber === 7) {
        cell.font = { name: "Consolas", size: 9.5, color: { argb: "FF334155" } };
      }

      // Zebra background
      if (rowIndex % 2 === 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" },
        };
      }
    });

    // Generate & Embed Barcode Image if available
    if (barcodeVal) {
      try {
        const barcodeImg = await generateBarcodeImageBase64(barcodeVal);
        if (barcodeImg && barcodeImg.base64Data) {
          const imageId = workbook.addImage({
            base64: barcodeImg.base64Data,
            extension: "png",
          });

          // Column 8 is 'Barcode Sticker (Image)' (0-indexed col 7)
          worksheet.addImage(imageId, {
            tl: { col: 7.15, row: rowIndex - 1 + 0.1 },
            ext: { width: 145, height: 48 },
            editAs: "oneCell",
          });
        }
      } catch (imgErr) {
        console.warn(`Failed to embed barcode for ${barcodeVal}:`, imgErr);
      }
    }
  }

  // Write and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const downloadUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(downloadUrl);
};
