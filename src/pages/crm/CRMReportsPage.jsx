import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import {
  FileSpreadsheet, Printer, Filter, Box, ArrowDownCircle, ArrowUpCircle,
  FileText, Repeat, AlertTriangle, ShoppingCart, Clock, Search
} from "lucide-react";
import * as XLSX from "xlsx";

const CRMReportsPage = () => {
  const { t, lang } = useLanguage();

  const [activeTab, setActiveTab] = useState("inventory"); // inventory, stockIn, stockOut, customerOrders, productMovement, lowStock, customerPurchases, openOrders
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("reportsHub")}
        description={lang === "no" ? "Sanntidsrapporter for lager, varemottak, vareutgang, B2B-ordrer og pakkevekt med eksport til Excel og PDF." : "Flexible system reports for inventory, stock in/out, B2B orders, and parcel weights."}
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition"
            >
              <FileSpreadsheet size={16} />
              <span>{t("exportExcel")}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition"
            >
              <Printer size={16} />
              <span>{t("exportPdf")}</span>
            </button>
          </div>
        }
      />

      {/* REPORT CATEGORY TABS */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-bold">
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
      <SurfaceCard className="p-4">
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
