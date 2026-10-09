import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImg from "../assets/newlogo.png";
import { isNorwegian, tr } from "./appLang";

const NAVY = [10, 56, 102];

const money = (value) =>
  Number(value || 0).toLocaleString(isNorwegian() ? "nb-NO" : "en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const dateText = (value) =>
  new Date(value).toLocaleDateString(isNorwegian() ? "nb-NO" : "en-GB");

const customerName = (sale) =>
  sale.customer?.companyName || sale.customer?.fullName || tr("Walk-in Customer", "Gjestekunde");

const productsText = (sale) =>
  (sale.saleItems || [])
    .map((item) => {
      const variant = [item.product?.color, item.product?.size].filter(Boolean).join("/");
      return `${item.product?.productName || tr("Product", "Produkt")} x${item.quantity}${variant ? ` (${variant})` : ""}`;
    })
    .join("; ");

const itemCount = (sale) => (sale.saleItems || []).reduce((n, it) => n + Number(it.quantity || 0), 0);

const totalsOf = (sales) =>
  sales.reduce(
    (acc, s) => ({
      count: acc.count + 1,
      items: acc.items + itemCount(s),
      subtotal: acc.subtotal + Number(s.subtotal || 0),
      discount: acc.discount + Number(s.discount || 0),
      tax: acc.tax + Number(s.tax || 0),
      grandTotal: acc.grandTotal + Number(s.grandTotal || 0),
    }),
    { count: 0, items: 0, subtotal: 0, discount: 0, tax: 0, grandTotal: 0 }
  );

const periodText = (from, to) => {
  if (!from && !to) return tr("All time", "Hele perioden");
  return `${from || "…"} – ${to || tr("Present", "I dag")}`;
};

const fileStamp = () => new Date().toISOString().slice(0, 10);

const safeName = (s) => String(s || "").replace(/[^a-zA-Z0-9æøåÆØÅ_-]+/g, "_").replace(/^_+|_+$/g, "");

export const exportSalesToExcel = async ({ sales, customerLabel, from, to }) => {
  if (!sales.length) throw new Error(tr("No sales to export.", "Ingen salg å eksportere."));

  const totals = totalsOf(sales);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nordic Prowear AS";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet(tr("Sales", "Salg"), { views: [{ state: "frozen", ySplit: 6 }] });

  sheet.mergeCells("A1:K1");
  const title = sheet.getCell("A1");
  title.value = tr("NORDIC PROWEAR - SALES REPORT", "NORDIC PROWEAR - SALGSRAPPORT");
  title.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0A3866" } };
  title.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 32;

  const info = [
    [tr("Customer", "Kunde"), customerLabel],
    [tr("Period", "Periode"), periodText(from, to)],
    [tr("Number of sales", "Antall salg"), totals.count],
    [tr("Total sales (NOK)", "Total omsetning (NOK)"), Number(totals.grandTotal.toFixed(2))],
  ];
  info.forEach(([label, value], i) => {
    const row = sheet.getRow(2 + i);
    row.getCell(1).value = label;
    row.getCell(1).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF475569" } };
    row.getCell(2).value = value;
    row.getCell(2).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };
    row.getCell(2).alignment = { horizontal: "left" };
  });

  const headers = [
    tr("Invoice", "Faktura"),
    tr("Date", "Dato"),
    tr("Customer", "Kunde"),
    tr("Contact", "Kontakt"),
    tr("Products", "Produkter"),
    tr("Items", "Antall"),
    tr("Payment", "Betaling"),
    tr("Subtotal (NOK)", "Delsum (NOK)"),
    tr("Discount (NOK)", "Rabatt (NOK)"),
    tr("VAT (NOK)", "MVA (NOK)"),
    tr("Total (NOK)", "Totalt (NOK)"),
  ];
  const headerRow = sheet.getRow(6);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E293B" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });
  headerRow.height = 26;

  [16, 12, 28, 22, 60, 9, 16, 15, 15, 14, 16].forEach((w, i) => {
    sheet.getColumn(i + 1).width = w;
  });

  sales.forEach((sale, idx) => {
    const row = sheet.addRow([
      sale.invoiceNumber,
      dateText(sale.createdAt),
      customerName(sale),
      sale.customer?.fullName && sale.customer?.companyName ? sale.customer.fullName : "",
      productsText(sale),
      itemCount(sale),
      sale.paymentMethod,
      Number(sale.subtotal || 0),
      Number(sale.discount || 0),
      Number(sale.tax || 0),
      Number(sale.grandTotal || 0),
    ]);
    row.alignment = { vertical: "top", wrapText: true };
    if (idx % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
      });
    }
    [8, 9, 10, 11].forEach((c) => {
      row.getCell(c).numFmt = "#,##0.00";
    });
  });

  const totalRow = sheet.addRow([
    tr("TOTAL", "TOTALT"), "", "", "", "",
    totals.items, "",
    Number(totals.subtotal.toFixed(2)),
    Number(totals.discount.toFixed(2)),
    Number(totals.tax.toFixed(2)),
    Number(totals.grandTotal.toFixed(2)),
  ]);
  totalRow.eachCell((cell) => {
    cell.font = { name: "Calibri", size: 10, bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
  });
  [8, 9, 10, 11].forEach((c) => {
    totalRow.getCell(c).numFmt = "#,##0.00";
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${tr("Sales_Report", "Salgsrapport")}_${safeName(customerLabel)}_${fileStamp()}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const loadLogo = () =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = logoImg;
  });

export const exportSalesToPDF = async ({ sales, customerLabel, from, to }) => {
  if (!sales.length) throw new Error(tr("No sales to export.", "Ingen salg å eksportere."));

  const totals = totalsOf(sales);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 12;

  const logo = await loadLogo();
  if (logo) doc.addImage(logo, "PNG", margin, margin - 2, 22, 22);

  const textX = margin + (logo ? 28 : 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("NORDIC PROWEAR", textX, margin + 3);
  doc.setFontSize(17);
  doc.setTextColor(...NAVY);
  doc.text(tr("Sales Report", "Salgsrapport"), textX, margin + 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `${tr("Customer", "Kunde")}: ${customerLabel}   |   ${tr("Period", "Periode")}: ${periodText(from, to)}`,
    textX,
    margin + 17
  );

  // Summary boxes
  const boxes = [
    [tr("Number of sales", "Antall salg"), String(totals.count)],
    [tr("Items sold", "Solgte varer"), String(totals.items)],
    [tr("Subtotal (NOK)", "Delsum (NOK)"), money(totals.subtotal)],
    [tr("VAT (NOK)", "MVA (NOK)"), money(totals.tax)],
    [tr("Total sales (NOK)", "Total omsetning (NOK)"), money(totals.grandTotal)],
  ];
  const boxW = (pageW - margin * 2 - (boxes.length - 1) * 4) / boxes.length;
  const boxY = margin + 24;
  boxes.forEach(([label, value], i) => {
    const x = margin + i * (boxW + 4);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, boxY, boxW, 15, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(label.toUpperCase(), x + 3, boxY + 5);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(value, x + 3, boxY + 12);
  });

  autoTable(doc, {
    startY: boxY + 20,
    margin: { left: margin, right: margin, bottom: 14 },
    theme: "grid",
    head: [[
      tr("Invoice", "Faktura"),
      tr("Date", "Dato"),
      tr("Customer", "Kunde"),
      tr("Products", "Produkter"),
      tr("Payment", "Betaling"),
      tr("Subtotal", "Delsum"),
      tr("VAT", "MVA"),
      tr("Total (NOK)", "Totalt (NOK)"),
    ]],
    body: sales.map((s) => [
      s.invoiceNumber,
      dateText(s.createdAt),
      customerName(s),
      productsText(s),
      s.paymentMethod,
      money(s.subtotal),
      money(s.tax),
      money(s.grandTotal),
    ]),
    foot: [[
      tr("TOTAL", "TOTALT"), "", "", "", "",
      money(totals.subtotal), money(totals.tax), money(totals.grandTotal),
    ]],
    showFoot: "lastPage",
    styles: { fontSize: 7.5, cellPadding: 1.8, valign: "top", lineColor: [226, 232, 240], textColor: [30, 41, 59] },
    headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: "bold" },
    footStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 20 },
      2: { cellWidth: 42 },
      4: { cellWidth: 24 },
      5: { halign: "right", cellWidth: 24 },
      6: { halign: "right", cellWidth: 20 },
      7: { halign: "right", cellWidth: 26 },
    },
  });

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Nordic Prowear AS - ${tr("Sales Report", "Salgsrapport")}`,
      margin,
      pageH - 7
    );
    doc.text(
      `${new Date().toLocaleDateString(isNorwegian() ? "nb-NO" : "en-GB")}  |  ${tr("Page", "Side")} ${i} ${tr("of", "av")} ${pages}`,
      pageW - margin,
      pageH - 7,
      { align: "right" }
    );
  }

  doc.save(`${tr("Sales_Report", "Salgsrapport")}_${safeName(customerLabel)}_${fileStamp()}.pdf`);
};
