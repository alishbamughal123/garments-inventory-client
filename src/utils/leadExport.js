import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImg from "../assets/logo.png";

/**
 * Format status for human display
 */
const formatStatus = (status, isNo = false) => {
  const statusMap = {
    NEW: isNo ? "Ny" : "New",
    CONTACTED: isNo ? "Kontaktet" : "Contacted",
    QUALIFIED: isNo ? "Kvalifisert" : "Qualified",
    PROPOSAL_SENT: isNo ? "Tilbud sendt" : "Proposal Sent",
    NEGOTIATION: isNo ? "Forhandling" : "Negotiation",
    WON: isNo ? "Vunnet" : "Won",
    LOST: isNo ? "Tapt" : "Lost",
  };
  return statusMap[status] || status || "-";
};

/**
 * Export Leads to a professionally styled Excel Workbook (.xlsx)
 */
export const exportLeadsToExcel = async ({
  leads = [],
  activeTabLabel = "All Leads",
  priorityFilter = "ALL",
  searchQuery = "",
  isNo = false,
  fileName = "Nordic_Prowear_Leads_Report",
}) => {
  if (!leads || leads.length === 0) {
    throw new Error(isNo ? "Ingen leads å eksportere." : "No leads available to export.");
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nordic Prowear AS CRM";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(isNo ? "B2B Leads" : "B2B Leads", {
    views: [{ showGridLines: true }],
  });

  // 1. Title Block (Header banner)
  worksheet.mergeCells("A1:M1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "NORDIC PROWEAR AS — B2B LEADS & PIPELINE DIRECTORY";
  titleCell.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } }; // Slate-900
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.getRow(1).height = 34;

  // 2. Metadata / Filter Block
  const metaRows = [
    [
      isNo ? "Bransje / Kategori:" : "Industry Segment:",
      activeTabLabel,
      isNo ? "Prioritetsfilter:" : "Priority Filter:",
      priorityFilter === "ALL" ? (isNo ? "Alle" : "All") : priorityFilter,
      isNo ? "Generert dato:" : "Generated On:",
      new Date().toLocaleString(isNo ? "nb-NO" : "en-US"),
    ],
    [
      isNo ? "Søkeord:" : "Search Query:",
      searchQuery || (isNo ? "Ingen (Alle)" : "None (All)"),
      isNo ? "Totalt antall leads:" : "Total Leads:",
      `${leads.length} ${isNo ? "bedrifter" : "leads"}`,
      isNo ? "System:" : "System:",
      "Nordic Prowear Enterprise CRM",
    ],
  ];

  metaRows.forEach((rowVals) => {
    const row = worksheet.addRow(rowVals);
    row.height = 22;
    for (let c = 1; c <= 6; c += 2) {
      row.getCell(c).font = { name: "Calibri", size: 9.5, bold: true, color: { argb: "FF475569" } };
      row.getCell(c).alignment = { vertical: "middle", horizontal: "left" };
      row.getCell(c + 1).font = { name: "Calibri", size: 9.5, bold: true, color: { argb: "FF0F172A" } };
      row.getCell(c + 1).alignment = { vertical: "middle", horizontal: "left" };
    }
  });

  // Empty separator row
  worksheet.addRow([]);
  worksheet.getRow(4).height = 10;

  // 3. Define Table Columns
  const columns = [
    { header: isNo ? "Rangering (#)" : "Rank (#)", key: "rank", width: 12 },
    { header: isNo ? "Bedriftsnavn" : "Company Name", key: "companyName", width: 32 },
    { header: isNo ? "Juridisk Navn" : "Legal Entity", key: "legalEntity", width: 28 },
    { header: isNo ? "Kontaktperson" : "Contact Person", key: "fullName", width: 24 },
    { header: isNo ? "Stilling / Rolle" : "Designation / Role", key: "designation", width: 22 },
    { header: isNo ? "Telefon" : "Phone Number", key: "phoneNumber", width: 18 },
    { header: isNo ? "E-postadresse" : "Email Address", key: "email", width: 28 },
    { header: isNo ? "Bransje / Segment" : "Segment / Sector", key: "segment", width: 24 },
    { header: isNo ? "Prioritet" : "Priority", key: "priority", width: 14 },
    { header: isNo ? "Status" : "Status", key: "status", width: 16 },
    { header: isNo ? "Omsetning (MNOK)" : "Revenue (MNOK)", key: "revenueMnok", width: 18 },
    { header: isNo ? "Regnskapsår" : "Financial Year", key: "financialYear", width: 15 },
    { header: isNo ? "By / Sted" : "City", key: "city", width: 18 },
    { header: isNo ? "Fylke" : "County", key: "county", width: 20 },
    { header: isNo ? "Ansatte / Potensial" : "Relevant Staff", key: "relevantStaff", width: 24 },
    { header: isNo ? "Tekstilbehov / Produkter" : "Relevant Textiles", key: "relevantTextiles", width: 30 },
    { header: isNo ? "Ansvarlig Selger" : "Assigned To", key: "assignedTo", width: 20 },
    { header: isNo ? "Notater / Kommentarer" : "Notes / Remarks", key: "notes", width: 36 },
  ];

  worksheet.columns = columns;

  // 4. Style Table Header Row (Row 5)
  const headerRow = worksheet.getRow(5);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E293B" }, // Slate-800
    };
    cell.font = {
      name: "Calibri",
      size: 10.5,
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

  // 5. Populate Data Rows
  leads.forEach((lead, idx) => {
    const rowIndex = idx + 6;
    const rev = lead.revenueMnok != null && !isNaN(Number(lead.revenueMnok)) ? Number(lead.revenueMnok) : null;

    const row = worksheet.addRow({
      rank: lead.rank ? `#${lead.rank}` : "-",
      companyName: lead.companyName || lead.fullName || "-",
      legalEntity: lead.legalEntity || "-",
      fullName: lead.fullName || "-",
      designation: lead.designation || "-",
      phoneNumber: lead.phoneNumber || "-",
      email: lead.email || "-",
      segment: lead.segment || "-",
      priority: lead.priority || "-",
      status: formatStatus(lead.status, isNo),
      revenueMnok: rev != null ? rev : "-",
      financialYear: lead.financialYear || "-",
      city: lead.city || "-",
      county: lead.county || "-",
      relevantStaff: lead.relevantStaff || "-",
      relevantTextiles: lead.relevantTextiles || "-",
      assignedTo: lead.assignedTo?.name || lead.assignedTo?.email || "-",
      notes: lead.notes || "-",
    });

    row.height = 24;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.font = { name: "Calibri", size: 10, color: { argb: "FF1E293B" } };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
      cell.alignment = { vertical: "middle", horizontal: "left" };

      // Center align specific columns (Rank, Priority, Status, Year)
      if ([1, 9, 10, 12].includes(colNumber)) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }

      // Format Company Name bold
      if (colNumber === 2) {
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };
      }

      // Format Revenue column
      if (colNumber === 11) {
        cell.alignment = { vertical: "middle", horizontal: "right" };
        if (typeof cell.value === "number") {
          cell.numFmt = '#,##0.0 "MNOK"';
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF047857" } };
        }
      }

      // Priority color highlighting
      if (colNumber === 9 && lead.priority) {
        if (["A+", "A"].includes(lead.priority)) {
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF047857" } };
        } else if (lead.priority === "A-") {
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0E7490" } };
        } else if (["B+", "B"].includes(lead.priority)) {
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFB45309" } };
        } else if (lead.priority === "Tender") {
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF6B21A8" } };
        }
      }

      // Zebra striping
      if (rowIndex % 2 === 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" },
        };
      }
    });
  });

  // Write and trigger download in browser
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const downloadUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  const dateStamp = new Date().toISOString().slice(0, 10);
  anchor.download = `${fileName}_${dateStamp}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Export Leads to a high quality PDF Document (.pdf)
 */
export const exportLeadsToPDF = async ({
  leads = [],
  activeTabLabel = "All Leads",
  priorityFilter = "ALL",
  searchQuery = "",
  isNo = false,
  fileName = "Nordic_Prowear_Leads_Report",
}) => {
  if (!leads || leads.length === 0) {
    throw new Error(isNo ? "Ingen leads å eksportere." : "No leads available to export.");
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm

  // Top Dark Banner (#0F172A)
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 26, "F");

  // Accent line (#2563EB)
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 26, pageWidth, 2, "F");

  // Brand Logo or Title
  try {
    const img = new Image();
    img.src = logoImg;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
    doc.addImage(img, "PNG", 12, 3.5, 36, 19);
  } catch {
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("NORDIC PROWEAR", 14, 16);
  }

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(
    isNo ? "B2B SALGSMULIGHETER & LEADS RAPPORT" : "B2B LEADS & CRM PIPELINE REPORT",
    pageWidth - 14,
    13,
    { align: "right" }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  const genDateStr = new Date().toLocaleString(isNo ? "nb-NO" : "en-US");
  doc.text(`${isNo ? "Generert" : "Generated"}: ${genDateStr}`, pageWidth - 14, 19, { align: "right" });

  let startY = 34;

  // Calculate Metrics for summary cards
  const totalLeads = leads.length;
  const highPriorityCount = leads.filter((l) => ["A+", "A"].includes(l.priority)).length;
  const tenderCount = leads.filter((l) => l.priority === "Tender").length;
  const totalTurnover = leads.reduce((sum, l) => {
    const v = Number(l.revenueMnok);
    return !isNaN(v) && v > 0 ? sum + v : sum;
  }, 0);

  // Summary Metrics Cards
  const summaryCards = [
    {
      label: isNo ? "TOTALT ANTALL LEADS" : "TOTAL LEADS",
      value: totalLeads.toLocaleString(),
      sub: activeTabLabel,
    },
    {
      label: isNo ? "HØY PRIORITET (A+ / A)" : "HIGH PRIORITY (A+ / A)",
      value: highPriorityCount.toString(),
      sub: `${Math.round((highPriorityCount / (totalLeads || 1)) * 100)}% of total`,
    },
    {
      label: isNo ? "ANBUD / TENDERS" : "TENDER OPPORTUNITIES",
      value: tenderCount.toString(),
      sub: isNo ? "Offentlig / Rammeavtaler" : "Public & Framework",
    },
    {
      label: isNo ? "TOTAL OMSETNING I PIPELINE" : "TOTAL PIPELINE TURNOVER",
      value: totalTurnover > 0 ? `${totalTurnover.toLocaleString("en-US", { maximumFractionDigits: 1 })} MNOK` : "-",
      sub: isNo ? "Samlet bedriftsomsetning" : "Combined customer revenue",
    },
  ];

  const cardWidth = 64;
  const cardGap = (pageWidth - 28 - cardWidth * 4) / 3;

  summaryCards.forEach((card, idx) => {
    const x = 14 + idx * (cardWidth + cardGap);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, startY, cardWidth, 16, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(card.label, x + 4, startY + 4.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(card.value, x + 4, startY + 10.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(card.sub.slice(0, 28), x + 4, startY + 14.5);
  });

  startY += 22;

  // Filter Bar details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const filterDesc = `${isNo ? "Kategori" : "Segment"}: ${activeTabLabel}   |   ${isNo ? "Prioritet" : "Priority"}: ${priorityFilter === "ALL" ? (isNo ? "Alle" : "All") : priorityFilter}${searchQuery ? `   |   ${isNo ? "Søk" : "Search"}: "${searchQuery}"` : ""}`;
  doc.text(filterDesc, 14, startY);

  startY += 4;

  // Table Data Preparation
  const tableHeaders = [
    isNo ? "#" : "#",
    isNo ? "Bedrift / Selskap" : "Company Name",
    isNo ? "Kontaktperson & Stilling" : "Contact & Role",
    isNo ? "Telefon / E-post" : "Phone & Email",
    isNo ? "Bransje / Segment" : "Segment / Sector",
    isNo ? "Prio" : "Prio",
    isNo ? "Omsetning" : "Revenue",
    isNo ? "Sted / Fylke" : "Location",
    isNo ? "Status" : "Status",
  ];

  const tableRows = leads.map((lead) => {
    const rankStr = lead.rank ? `#${lead.rank}` : "-";
    const company = lead.companyName || lead.fullName || "-";
    const contact = `${lead.fullName || "-"}${lead.designation ? `\n(${lead.designation})` : ""}`;
    const phoneEmail = `${lead.phoneNumber || "-"}${lead.email ? `\n${lead.email}` : ""}`;
    const segment = lead.segment || "-";
    const priority = lead.priority || "-";
    const revStr = lead.revenueMnok ? `${Number(lead.revenueMnok).toFixed(1)} MNOK` : "-";
    const location = `${lead.city || "-"}${lead.county ? `\n${lead.county}` : ""}`;
    const status = formatStatus(lead.status, isNo);

    return [rankStr, company, contact, phoneEmail, segment, priority, revStr, location, status];
  });

  // Render AutoTable
  autoTable(doc, {
    startY: startY,
    head: [tableHeaders],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [30, 41, 59], // #1E293B
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: "bold",
      halign: "left",
      valign: "middle",
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [51, 65, 85],
      valign: "middle",
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center", font: "courier" },
      1: { cellWidth: 42, fontStyle: "bold", textColor: [15, 23, 42] },
      2: { cellWidth: 38 },
      3: { cellWidth: 42 },
      4: { cellWidth: 36 },
      5: { cellWidth: 14, halign: "center", fontStyle: "bold" },
      6: { cellWidth: 24, halign: "right", fontStyle: "bold", textColor: [4, 120, 87] },
      7: { cellWidth: 32 },
      8: { cellWidth: 26, halign: "center" },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didDrawCell: (data) => {
      // Custom colored text for Priority in column 5
      if (data.section === "body" && data.column.index === 5) {
        const val = data.cell.raw;
        if (["A+", "A"].includes(val)) {
          doc.setTextColor(4, 120, 87); // Emerald
        } else if (val === "A-") {
          doc.setTextColor(14, 116, 144); // Cyan
        } else if (["B+", "B"].includes(val)) {
          doc.setTextColor(180, 83, 9); // Amber
        } else if (val === "Tender") {
          doc.setTextColor(107, 33, 168); // Purple
        }
      }
    },
    didDrawPage: (data) => {
      // Footer with page numbering
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("Nordic Prowear AS — Confidential Internal CRM Document", 14, pageHeight - 6);

      const pageNumStr = `${isNo ? "Side" : "Page"} ${doc.internal.getNumberOfPages()}`;
      doc.text(pageNumStr, pageWidth - 14, pageHeight - 6, { align: "right" });
    },
  });

  // Trigger download
  const dateStamp = new Date().toISOString().slice(0, 10);
  doc.save(`${fileName}_${dateStamp}.pdf`);
};
