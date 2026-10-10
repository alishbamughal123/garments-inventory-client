import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { loadPdfLogo } from "./pdfLogo";
import { resolveProductImageUrl } from "./imageHelper";

const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, "")
  : "http://localhost:8000";

const NAVY = [10, 56, 102];
const SLATE = [71, 85, 105];
const LIGHT = [241, 245, 249];

const COMPANY = {
  name: "Nordic Prowear AS",
  address: "Storgt. 15, 1607 Fredrikstad",
  email: "post@nordicprowear.no",
};

const LABELS = {
  en: {
    saleTitle: "SALES RECEIPT",
    orderTitle: "ORDER CONFIRMATION",
    receiptNo: "Receipt No",
    orderNo: "Order No",
    date: "Date",
    status: "Status",
    billTo: "CUSTOMER",
    walkIn: "Walk-in Customer",
    contact: "Contact",
    phone: "Phone",
    email: "Email",
    vat: "VAT / Org Nr",
    customerCode: "Customer Code",
    address: "Address",
    deliverTo: "DELIVERY ADDRESS",
    payment: "Payment",
    article: "Article",
    qty: "Qty",
    unitPrice: "Unit Price",
    total: "Total",
    subtotal: "Subtotal",
    discount: "Discount",
    vatLine: "VAT (MVA)",
    grandTotal: "Grand Total",
    notes: "Notes",
    thanks: "Thank you for your business!",
    page: "Page",
    of: "of",
    locale: "en-GB",
    edited: "Updated",
  },
  no: {
    saleTitle: "SALGSKVITTERING",
    orderTitle: "ORDREBEKREFTELSE",
    receiptNo: "Kvitteringsnr",
    orderNo: "Ordrenr",
    date: "Dato",
    status: "Status",
    billTo: "KUNDE",
    walkIn: "Gjestekunde",
    contact: "Kontakt",
    phone: "Telefon",
    email: "E-post",
    vat: "MVA / Org.nr",
    customerCode: "Kundekode",
    address: "Adresse",
    deliverTo: "LEVERINGSADRESSE",
    payment: "Betaling",
    article: "Artikkel",
    qty: "Ant.",
    unitPrice: "Enhetspris",
    total: "Totalt",
    subtotal: "Delsum",
    discount: "Rabatt",
    vatLine: "MVA",
    grandTotal: "Totalsum",
    notes: "Notater",
    thanks: "Takk for handelen!",
    page: "Side",
    of: "av",
    locale: "nb-NO",
    edited: "Oppdatert",
  },
};

const money = (value) =>
  `NOK ${Number(value || 0).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Loads a product image as a white-background JPEG data URL (works for PNG/transparent images).
// Resolves to null on any failure so the receipt still generates without that image.
const loadImageData = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 1;
        canvas.height = img.naturalHeight || 1;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve({ data: canvas.toDataURL("image/jpeg", 0.85), w: canvas.width, h: canvas.height });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const productImageSrc = (product) => {
  if (!product) return null;
  const url = resolveProductImageUrl(product.imageUrl, product.baseStyleNumber, product.color);
  if (!url || url.includes("/placeholders/") || url.endsWith(".svg")) return null;
  if (url.startsWith("/uploads/")) return `${BACKEND_URL}${url}`;
  return url;
};

/*
|--------------------------------------------------------------------------
| Normalizers: ERP sale / B2B order -> common receipt shape
|--------------------------------------------------------------------------
*/
export const saleToReceipt = (sale) => ({
  kind: "sale",
  number: sale.invoiceNumber,
  date: sale.createdAt,
  customer: sale.customer || null,
  paymentMethod: sale.paymentMethod,
  notes: sale.notes,
  items: (sale.saleItems || []).map((it) => ({
    product: it.product,
    quantity: it.quantity,
    unitPrice: it.price,
    total: it.total,
  })),
  subtotal: sale.subtotal,
  discount: sale.discount,
  tax: sale.tax,
  grandTotal: sale.grandTotal,
});

export const orderToReceipt = (order) => ({
  kind: "order",
  number: order.orderNumber,
  date: order.createdAt,
  status: order.status,
  customer: order.customer || null,
  shippingAddress: order.shippingAddress,
  notes: order.notes,
  items: (order.orderItems || []).map((it) => ({
    product: it.product,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    total: it.totalPrice,
    extra: it.customNote || it.selectedLogo || "",
  })),
  subtotal: order.subtotal,
  discount: 0,
  tax: order.tax,
  grandTotal: order.totalAmount,
});

/*
|--------------------------------------------------------------------------
| Builds & downloads a professional receipt PDF (logo, customer, address,
| quantities, product images, totals).
|--------------------------------------------------------------------------
*/
export const downloadReceiptPdf = async (receipt, { isNo = false } = {}) => {
  const L = isNo ? LABELS.no : LABELS.en;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // ---------- HEADER ----------
  const logo = await loadPdfLogo();
  const logoSize = 24;
  if (logo) {
    try {
      doc.addImage(logo, "PNG", margin, y, logoSize, logoSize);
    } catch {
      /* logo is optional */
    }
  }
  const textX = margin + (logo ? logoSize + 5 : 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text(COMPANY.name.toUpperCase(), textX, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...SLATE);
  doc.text(COMPANY.address, textX, y + 14);
  doc.text(COMPANY.email, textX, y + 19);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...NAVY);
  doc.text(receipt.kind === "sale" ? L.saleTitle : L.orderTitle, pageW - margin, y + 8, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...SLATE);
  doc.text(
    `${receipt.kind === "sale" ? L.receiptNo : L.orderNo}: ${receipt.number || "-"}`,
    pageW - margin,
    y + 14,
    { align: "right" }
  );
  doc.text(
    `${L.date}: ${new Date(receipt.date || Date.now()).toLocaleDateString(L.locale)}`,
    pageW - margin,
    y + 19,
    { align: "right" }
  );
  if (receipt.status) {
    doc.text(`${L.status}: ${receipt.status}`, pageW - margin, y + 24, { align: "right" });
  }

  y += logoSize + 6;
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageW - margin, y);
  y += 7;

  // ---------- CUSTOMER / DELIVERY ----------
  const customer = receipt.customer;
  const customerLines = [];
  if (customer) {
    customerLines.push(customer.companyName || customer.fullName);
    if (customer.companyName && customer.fullName) customerLines.push(`${L.contact}: ${customer.fullName}`);
    if (customer.phoneNumber) customerLines.push(`${L.phone}: ${customer.phoneNumber}`);
    if (customer.email) customerLines.push(`${L.email}: ${customer.email}`);
    if (customer.vatNumber) customerLines.push(`${L.vat}: ${customer.vatNumber}`);
    if (customer.customerCode) customerLines.push(`${L.customerCode}: ${customer.customerCode}`);
    const addr = [customer.address, customer.city].filter(Boolean).join(", ");
    if (addr && receipt.kind === "sale") customerLines.push(`${L.address}: ${addr}`);
  } else {
    customerLines.push(L.walkIn);
  }

  const colW = (pageW - margin * 2 - 6) / 2;
  const deliveryLines =
    receipt.kind === "order"
      ? doc.splitTextToSize(
          receipt.shippingAddress ||
            [customer?.address, customer?.city].filter(Boolean).join(", ") ||
            "-",
          colW - 8
        )
      : [`${L.payment}: ${String(receipt.paymentMethod || "-").replace(/_/g, " ")}`];

  const boxH = Math.max(customerLines.length, deliveryLines.length + 0) * 5 + 12;

  const drawBox = (x, title, lines) => {
    doc.setFillColor(...LIGHT);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, colW, boxH, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...SLATE);
    doc.text(title, x + 4, y + 6);
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    lines.forEach((line, i) => {
      doc.setFont("helvetica", i === 0 && title === L.billTo ? "bold" : "normal");
      doc.text(String(line), x + 4, y + 12 + i * 5);
    });
  };

  drawBox(margin, L.billTo, customerLines);
  drawBox(margin + colW + 6, receipt.kind === "order" ? L.deliverTo : L.payment.toUpperCase(),
    receipt.kind === "order" ? deliveryLines : [String(receipt.paymentMethod || "-").replace(/_/g, " ")]);
  y += boxH + 8;

  // ---------- ITEMS (with product images) ----------
  const images = await Promise.all(
    (receipt.items || []).map((it) => loadImageData(productImageSrc(it.product)))
  );
  const ROW_H = 18;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin, bottom: 22 },
    head: [["", L.article, L.qty, L.unitPrice, L.total]],
    body: (receipt.items || []).map((it) => {
      const p = it.product || {};
      const meta = [p.sku, [p.color, p.size].filter(Boolean).join(" / ")].filter(Boolean).join("  •  ");
      return [
        "",
        `${p.productName || "-"}\n${meta}${it.extra ? `\n[${it.extra}]` : ""}`,
        String(it.quantity),
        money(it.unitPrice),
        money(it.total),
      ];
    }),
    headStyles: { fillColor: NAVY, textColor: 255, fontSize: 9 },
    styles: { fontSize: 9, minCellHeight: ROW_H, valign: "middle", textColor: [15, 23, 42] },
    columnStyles: {
      0: { cellWidth: ROW_H + 2 },
      2: { halign: "center", cellWidth: 14 },
      3: { halign: "right", cellWidth: 32 },
      4: { halign: "right", cellWidth: 32 },
    },
    didDrawCell: (data) => {
      if (data.section !== "body" || data.column.index !== 0) return;
      const img = images[data.row.index];
      if (!img) return;
      const box = ROW_H - 2;
      const ratio = Math.min(box / img.w, box / img.h);
      const w = img.w * ratio;
      const h = img.h * ratio;
      try {
        doc.addImage(img.data, "JPEG", data.cell.x + (data.cell.width - w) / 2, data.cell.y + (data.cell.height - h) / 2, w, h);
      } catch {
        /* skip image on failure */
      }
    },
  });

  y = doc.lastAutoTable.finalY + 8;

  // ---------- TOTALS ----------
  if (y + 40 > pageH - 22) {
    doc.addPage();
    y = margin;
  }
  const totalsX = pageW - margin - 70;
  const line = (label, value, opts = {}) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(opts.big ? 12 : 9.5);
    doc.setTextColor(...(opts.color || SLATE));
    doc.text(label, totalsX, y);
    doc.text(value, pageW - margin, y, { align: "right" });
    y += opts.big ? 8 : 6;
  };
  line(L.subtotal, money(receipt.subtotal));
  if (Number(receipt.discount) > 0) line(L.discount, `- ${money(receipt.discount)}`);
  line(L.vatLine, money(receipt.tax));
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.4);
  doc.line(totalsX, y - 3, pageW - margin, y - 3);
  y += 1;
  line(L.grandTotal, money(receipt.grandTotal), { bold: true, big: true, color: NAVY });

  if (receipt.notes) {
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    doc.text(`${L.notes}:`, margin, y);
    doc.setFont("helvetica", "normal");
    const noteLines = doc.splitTextToSize(String(receipt.notes), pageW - margin * 2 - 20);
    doc.text(noteLines, margin + 18, y);
  }

  // ---------- FOOTER (every page) ----------
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 16, pageW - margin, pageH - 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE);
    doc.text(`${L.page} ${i} ${L.of} ${pages}`, pageW - margin, pageH - 10, { align: "right" });
  }

  doc.save(`${receipt.kind === "sale" ? "Receipt" : "OrderConfirmation"}_${receipt.number || "document"}.pdf`);
};
