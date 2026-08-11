import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import logoImg from "../../assets/logo.png";
import {
  FileSpreadsheet, Printer, Filter, Box, ArrowDownCircle, ArrowUpCircle,
  FileText, Repeat, AlertTriangle, ShoppingCart, Clock, Download, FileDown
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CRMReportsPage = () => {
  const { t, lang } = useLanguage();

  const [activeTab, setActiveTab] = useState("inventory");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = { from: fromDate, to: toDate };
      let endpoint = "/reports/inventory";

      if (activeTab === "stockIn") endpoint = "/reports/stock-in";
      if (activeTab === "stockOut") endpoint = "/reports/stock-out";
      if (activeTab === "customerOrders") endpoint = "/reports/customer-orders";
      if (activeTab === "productMovement") endpoint = "/reports/product-movement";
      if (activeTab === "lowStock") endpoint = "/reports/low-stock";
      if (activeTab === "customerPurchases") endpoint = "/reports/customer-purchases";
      if (activeTab === "openOrders") endpoint = "/reports/open-orders";

      const res = await api.get(endpoint, { params });
      setReportData(res.data.data || null);
    } catch {
      toast.error(lang === "no" ? "Kunne ikke hente rapport" : "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeTab]);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    fetchReport();
  };

  // EXPORT CURRENT REPORT TO EXCEL (.xlsx)
  const exportToExcel = () => {
    if (!reportData || !reportData.items || reportData.items.length === 0) {
      toast.error(lang === "no" ? "Ingen rapportdata å eksportere" : "No report data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(reportData.items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab.toUpperCase());
    XLSX.writeFile(workbook, `Nordic_Prowear_${activeTab}_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success(lang === "no" ? "Rapport eksportert til Excel" : "Report exported to Excel (.xlsx)");
  };

  // EXPORT BEAUTIFUL PDF REPORT WITH NORDIC LOGO
  const exportToPdf = async () => {
    if (!reportData || !reportData.items || reportData.items.length === 0) {
      toast.error(lang === "no" ? "Ingen rapportdata å eksportere" : "No report data to export");
      return;
    }

    try {
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
      const countText = `Total Items: ${reportData.items.length}`;
      doc.text(`${dateText}  |  ${countText}`, 14, startY + 5);

      startY += 12;

      // Summary Cards Grid (if summary metrics exist)
      if (reportData.summary && Object.keys(reportData.summary).length > 0) {
        const entries = Object.entries(reportData.summary);
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
      const headers = Object.keys(reportData.items[0]).map((col) =>
        col.replace(/([A-Z])/g, " $1").toUpperCase()
      );

      const rows = reportData.items.map((item) =>
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
          // Page Footer
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text("Nordic Prowear - Confidential Business Report", 14, pageHeight - 8);
          doc.text(
            `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
            pageWidth - 14,
            pageHeight - 8,
            { align: "right" }
          );
        },
      });

      const fileName = `Nordic_Prowear_${activeTab}_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
      toast.success(lang === "no" ? "Rapport eksportert til PDF" : "Report exported to PDF (.pdf)");
    } catch (err) {
      console.error("PDF Export Error:", err);
      toast.error("Failed to generate PDF report");
    }
  };

  return (
    <div className="space-y-6">
      {/* PRINT-ONLY LOGO & BRANDING HEADER */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Nordic Prowear Logo" className="h-12 object-contain" />
          <div>
            <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">Nordic Prowear</h1>
            <p className="text-xs text-slate-500 font-bold">System Management & CRM Reports</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-extrabold uppercase text-slate-900 block">{activeTab} Report</span>
          <span className="text-xs text-slate-500">Date: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <PageHeader
        title={t("reportsHub")}
        description={lang === "no" ? "Sanntidsrapporter for lager, varemottak, vareutgang, B2B-ordrer og pakkevekt med eksport til Excel og PDF med Nordic-logo." : "Flexible system reports for inventory, stock in/out, B2B orders, and parcel weights with Nordic branding PDF export."}
        action={
          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition"
            >
              <FileSpreadsheet size={16} />
              <span>{t("exportExcel")}</span>
            </button>

            <button
              type="button"
              onClick={exportToPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
            >
              <FileDown size={18} />
              <span>Download PDF (.pdf)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        }
      />

      {/* REPORT CATEGORY TABS */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-bold print:hidden">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`pb-3 px-4 border-b-2 flex items-center gap-1.5 transition ${activeTab === "inventory" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          <Box size={16} /> {t("reportInventory")}
        </button>

        <button
          onClick={() => setActiveTab("stockIn")}
          className={`pb-3 px-4 border-b-2 flex items-center gap-1.5 transition ${activeTab === "stockIn" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          <ArrowDownCircle size={16} /> {t("reportStockIn")}
        </button>

        <button
          onClick={() => setActiveTab("stockOut")}
          className={`pb-3 px-4 border-b-2 flex items-center gap-1.5 transition ${activeTab === "stockOut" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          <ArrowUpCircle size={16} /> {t("reportStockOut")}
        </button>

        <button
          onClick={() => setActiveTab("customerOrders")}
          className={`pb-3 px-4 border-b-2 flex items-center gap-1.5 transition ${activeTab === "customerOrders" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          <FileText size={16} /> {t("reportCustomerOrders")}
        </button>

        <button
          onClick={() => setActiveTab("productMovement")}
          className={`pb-3 px-4 border-b-2 flex items-center gap-1.5 transition ${activeTab === "productMovement" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          <Repeat size={16} /> {t("reportProductMovement")}
        </button>

        <button
          onClick={() => setActiveTab("lowStock")}
          className={`pb-3 px-4 border-b-2 flex items-center gap-1.5 transition ${activeTab === "lowStock" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          <AlertTriangle size={16} /> {t("reportLowStock")}
        </button>

        <button
          onClick={() => setActiveTab("customerPurchases")}
          className={`pb-3 px-4 border-b-2 flex items-center gap-1.5 transition ${activeTab === "customerPurchases" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          <ShoppingCart size={16} /> {t("reportCustomerPurchases")}
        </button>

        <button
          onClick={() => setActiveTab("openOrders")}
          className={`pb-3 px-4 border-b-2 flex items-center gap-1.5 transition ${activeTab === "openOrders" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          <Clock size={16} /> {t("reportOpenOrders")}
        </button>
      </div>

      {/* DATE FILTERS */}
      <SurfaceCard className="p-4 print:hidden">
        <form onSubmit={handleApplyFilter} className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">{t("fromDate")}:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">{t("toDate")}:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
          >
            <Filter size={14} />
            <span>{t("filterBtn")}</span>
          </button>
        </form>
      </SurfaceCard>

      {/* SUMMARY KPI BANNER */}
      {reportData?.summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(reportData.summary).map(([key, val]) => (
            <div key={key} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                {typeof val === "number" ? val.toLocaleString() : val}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* REPORT DATA TABLE */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading report data...</div>
      ) : !reportData || !reportData.items || reportData.items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
          No items found for the selected report filters.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm print:border-none print:shadow-none">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  {Object.keys(reportData.items[0]).map((col) => (
                    <th key={col} className="px-4 py-3.5 text-left whitespace-nowrap">
                      {col.replace(/([A-Z])/g, " $1")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.items.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    {Object.entries(row).map(([k, v], cIdx) => (
                      <td key={cIdx} className="px-4 py-3 text-slate-700 whitespace-nowrap font-medium">
                        {typeof v === "boolean" ? (v ? "Yes" : "No") : v != null ? String(v) : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMReportsPage;

