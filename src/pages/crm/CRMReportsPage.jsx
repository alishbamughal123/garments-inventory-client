import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import Pagination from "../../components/common/Pagination";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import logoImg from "../../assets/logo.png";
import {
  FileSpreadsheet, Filter, Box, ArrowDownCircle, ArrowUpCircle,
  FileText, Repeat, AlertTriangle, ShoppingCart, Clock, Download, FileDown
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CRMReportsPage = () => {
  const { t, lang, isNo } = useLanguage();

  const [activeTab, setActiveTab] = useState("inventory");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [exporting, setExporting] = useState(false);

  const getEndpoint = () => {
    let endpoint = "/reports/inventory";
    if (activeTab === "stockIn") endpoint = "/reports/stock-in";
    if (activeTab === "stockOut") endpoint = "/reports/stock-out";
    if (activeTab === "customerOrders") endpoint = "/reports/customer-orders";
    if (activeTab === "productMovement") endpoint = "/reports/product-movement";
    if (activeTab === "lowStock") endpoint = "/reports/low-stock";
    if (activeTab === "customerPurchases") endpoint = "/reports/customer-purchases";
    if (activeTab === "openOrders") endpoint = "/reports/open-orders";
    return endpoint;
  };

  const fetchReport = async (pageToFetch = page, pageSizeToFetch = pageSize) => {
    try {
      setLoading(true);
      const params = {
        from: fromDate || undefined,
        to: toDate || undefined,
        page: pageToFetch,
        limit: pageSizeToFetch,
      };

      const res = await api.get(getEndpoint(), { params });
      const rawData = res.data.data || null;

      if (rawData && Array.isArray(rawData.items)) {
        const total = rawData.pagination?.total || rawData.summary?.totalProducts || rawData.items.length;
        const totalPages = rawData.pagination?.totalPages || Math.max(1, Math.ceil(total / pageSizeToFetch));

        // If backend returned full array (e.g. from an unpaginated remote response), slice to exactly pageSize
        const displayItems = (rawData.items.length > pageSizeToFetch)
          ? rawData.items.slice((pageToFetch - 1) * pageSizeToFetch, pageToFetch * pageSizeToFetch)
          : rawData.items;

        setReportData({
          ...rawData,
          items: displayItems,
          pagination: {
            total,
            page: pageToFetch,
            limit: pageSizeToFetch,
            totalPages,
          },
        });
      } else {
        setReportData(rawData);
      }
    } catch {
      toast.error(lang === "no" ? "Kunne ikke hente rapport" : "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchReport(1, pageSize);
  }, [activeTab]);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReport(1, pageSize);
  };

  // Helper to fetch complete dataset for exports
  const fetchAllForExport = async () => {
    const res = await api.get(getEndpoint(), {
      params: {
        from: fromDate || undefined,
        to: toDate || undefined,
        all: "true",
      },
    });
    return res.data.data || { items: [], summary: {} };
  };

  // EXPORT CURRENT REPORT TO EXCEL (.xlsx)
  const exportToExcel = async () => {
    try {
      setExporting(true);
      toast.loading(isNo ? "Henter full rapport og eksporterer til Excel..." : "Fetching full report and exporting to Excel...", { id: "rep-excel" });
      const fullData = await fetchAllForExport();
      const exportItems = fullData.items || reportData?.items || [];

      if (exportItems.length === 0) {
        toast.error(lang === "no" ? "Ingen rapportdata å eksportere" : "No report data to export", { id: "rep-excel" });
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(exportItems);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, activeTab.toUpperCase());
      XLSX.writeFile(workbook, `Nordic_Prowear_${activeTab}_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success(lang === "no" ? `Rapport eksportert til Excel (${exportItems.length} rader)` : `Report exported to Excel (${exportItems.length} rows)`, { id: "rep-excel" });
    } catch (err) {
      console.error(err);
      toast.error(lang === "no" ? "Eksport mislyktes" : "Export failed", { id: "rep-excel" });
    } finally {
      setExporting(false);
    }
  };

  // EXPORT BEAUTIFUL PDF REPORT WITH NORDIC LOGO
  const exportToPdf = async () => {
    try {
      setExporting(true);
      toast.loading(isNo ? "Henter rapport og genererer PDF..." : "Fetching report and generating PDF...", { id: "rep-pdf" });
      const fullData = await fetchAllForExport();
      const exportItems = fullData.items || reportData?.items || [];

      if (exportItems.length === 0) {
        toast.error(lang === "no" ? "Ingen rapportdata å eksportere" : "No report data to export", { id: "rep-pdf" });
        return;
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Top Dark Header Banner
      doc.setFillColor(15, 23, 42); // #0F172A Dark Slate
      doc.rect(0, 0, pageWidth, 28, "F");

      doc.setFillColor(37, 99, 235); // #2563EB Royal Blue Accent Line
      doc.rect(0, 28, pageWidth, 2, "F");

      // Embed Nordic Logo
      try {
        const img = new Image();
        img.src = logoImg;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
        doc.addImage(img, "PNG", 12, 4, 38, 20);
      } catch {
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("NORDIC PROWEAR", 14, 18);
      }

      // Title & Date Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      const reportTitle = `${activeTab.replace(/([A-Z])/g, " $1").toUpperCase()} REPORT`;
      doc.text(reportTitle, pageWidth - 14, 14, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(203, 213, 225);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 21, { align: "right" });

      // Report Metadata Info
      let startY = 36;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Executive Summary & Report Parameters", 14, startY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const dateText = `Filter Period: ${fromDate || "All Time"} to ${toDate || "Present"}`;
      const countText = `Total Records: ${exportItems.length}`;
      doc.text(`${dateText}  |  ${countText}`, 14, startY + 5);

      startY += 12;

      // Summary Cards Grid (if summary metrics exist)
      const summaryObj = fullData.summary || reportData?.summary;
      if (summaryObj && Object.keys(summaryObj).length > 0) {
        const entries = Object.entries(summaryObj);
        const cardWidth = Math.min(65, (pageWidth - 28) / entries.length);

        entries.forEach(([k, v], idx) => {
          const x = 14 + idx * (cardWidth + 4);
          if (x + cardWidth <= pageWidth - 14) {
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(x, startY, cardWidth, 14, 2, 2, "FD");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(7);
            doc.setTextColor(100, 116, 139);
            const label = k.replace(/([A-Z])/g, " $1").toUpperCase();
            doc.text(label.slice(0, 28), x + 4, startY + 5);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            doc.setTextColor(15, 23, 42);
            const valStr = typeof v === "number" ? v.toLocaleString() : String(v);
            doc.text(valStr, x + 4, startY + 11);
          }
        });
        startY += 20;
      }

      // Styled AutoTable
      const headers = Object.keys(exportItems[0]).map((col) =>
        col.replace(/([A-Z])/g, " $1").toUpperCase()
      );

      const rows = exportItems.map((item) =>
        Object.values(item).map((val) =>
          typeof val === "boolean" ? (val ? "Yes" : "No") : val != null ? String(val) : "-"
        )
      );

      autoTable(doc, {
        startY: startY,
        head: [headers],
        body: rows,
        theme: "grid",
        headStyles: {
          fillColor: [30, 41, 59], // #1E293B
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "left",
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [51, 65, 85],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // #F8FAFC
        },
        margin: { left: 14, right: 14, bottom: 18 },
        didDrawPage: (data) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
          doc.text(pageStr, pageWidth - 14, pageHeight - 8, { align: "right" });
          doc.text("Nordic Prowear AS — Confidential Internal Report", 14, pageHeight - 8);
        },
      });

      doc.save(`Nordic_Prowear_${activeTab}_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success(lang === "no" ? "PDF lastet ned" : "PDF downloaded successfully", { id: "rep-pdf" });
    } catch (error) {
      console.error("PDF generation failed", error);
      toast.error(lang === "no" ? "Kunne ikke generere PDF" : "Failed to generate PDF", { id: "rep-pdf" });
    } finally {
      setExporting(false);
    }
  };

  const tabs = [
    { key: "inventory", label: "Inventory Valuation", icon: Box },
    { key: "stockIn", label: "Stock In Log", icon: ArrowDownCircle },
    { key: "stockOut", label: "Stock Out Log (Shipments)", icon: ArrowUpCircle },
    { key: "customerOrders", label: "Customer Orders", icon: ShoppingCart },
    { key: "productMovement", label: "Product Movement", icon: Repeat },
    { key: "lowStock", label: "Low Stock Alert", icon: AlertTriangle },
    { key: "customerPurchases", label: "Customer Purchases", icon: FileText },
    { key: "openOrders", label: "Open Orders Pipeline", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("systemReportsHeader")}
        description={t("systemReportsDesc")}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <FileSpreadsheet size={16} />
              <span>{t("exportExcel")}</span>
            </button>
            <button
              onClick={exportToPdf}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <FileDown size={16} />
              <span>{t("exportPdf")}</span>
            </button>
          </div>
        }
      />

      {/* HORIZONTAL TAB SELECTOR */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={16} />
              <span>{t(tab.label)}</span>
            </button>
          );
        })}
      </div>

      {/* FILTER CONTROLS BAR */}
      <SurfaceCard className="p-4">
        <form onSubmit={handleApplyFilter} className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <span>{t("dateFrom")}:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span>{t("dateTo")}:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <Filter size={14} />
            <span>{t("filterBtn")}</span>
          </button>
        </form>
      </SurfaceCard>

      {/* SUMMARY KPI BANNER */}
      {reportData?.summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(reportData.summary).map(([key, val]) => {
            const rawLabel = key.replace(/([A-Z])/g, " $1");
            return (
              <div key={key} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t(rawLabel)}
                </span>
                <span className="text-xl font-extrabold text-slate-900 mt-1 block font-mono">
                  {typeof val === "number" ? val.toLocaleString() : val}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* REPORT DATA TABLE */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">{t("loading")}</div>
      ) : !reportData || !reportData.items || reportData.items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
          {t("noData")}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4 print:border-none print:shadow-none">
          {/* Top Pagination Bar */}
          <Pagination
            currentPage={page}
            totalPages={reportData?.pagination?.totalPages || 1}
            totalItems={reportData?.pagination?.total || reportData?.items?.length || 0}
            pageSize={pageSize}
            onPageChange={(newPage) => {
              setPage(newPage);
              fetchReport(newPage, pageSize);
            }}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
              fetchReport(1, newSize);
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            itemLabel="records"
            itemLabelNo="rader"
            className="pt-0 border-t-0 pb-3 border-b border-slate-100"
          />

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  {Object.keys(reportData.items[0]).map((col) => {
                    const colName = col.replace(/([A-Z])/g, " $1");
                    return (
                      <th key={col} className="px-4 py-3.5 text-left whitespace-nowrap">
                        {t(colName)}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.items.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    {Object.entries(row).map(([k, v], cIdx) => (
                      <td key={cIdx} className="px-4 py-3 text-slate-700 whitespace-nowrap font-medium">
                        {typeof v === "boolean" ? (v ? (isNo ? "Ja" : "Yes") : (isNo ? "Nei" : "No")) : v != null ? String(v) : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reusable Pagination */}
          <Pagination
            currentPage={page}
            totalPages={reportData?.pagination?.totalPages || 1}
            totalItems={reportData?.pagination?.total || reportData?.items?.length || 0}
            pageSize={pageSize}
            onPageChange={(newPage) => {
              setPage(newPage);
              fetchReport(newPage, pageSize);
            }}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
              fetchReport(1, newSize);
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            itemLabel="records"
            itemLabelNo="rader"
          />
        </div>
      )}
    </div>
  );
};

export default CRMReportsPage;
