import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { CheckCircle, Truck, Package, Clock, Building2, Phone, Calendar, FileText, Download, Trash2 } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import DeleteModal from "../../components/common/DeleteModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { loadPdfLogo } from "../../utils/pdfLogo";

const B2BOrdersPage = () => {
  const { t, lang, isNo } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [fulfillingId, setFulfillingId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrderToDelete, setSelectedOrderToDelete] = useState(null);

  const fetchOrders = async (pageToFetch = page, pageSizeToFetch = pageSize, isStale = () => false) => {
    try {
      setLoading(true);
      const res = await api.get("/portal/admin/orders", {
        params: {
          status: statusFilter || undefined,
          search: search.trim() || undefined,
          page: pageToFetch,
          limit: pageSizeToFetch,
        }
      });
      if (isStale()) return;
      const items = res.data.data || [];
      setOrders(items);

      if (res.data.pagination) {
        setPaginationMeta(res.data.pagination);
      } else {
        setPaginationMeta({
          total: items.length,
          page: pageToFetch,
          limit: pageSizeToFetch,
          totalPages: Math.max(1, Math.ceil(items.length / pageSizeToFetch)),
        });
      }
    } catch {
      if (isStale()) return;
      toast.error(lang === "no" ? "Kunne ikke laste B2B-ordrer" : "Failed to load B2B orders");
    } finally {
      if (!isStale()) setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      fetchOrders(page, pageSize, () => cancelled);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [statusFilter, search, page, pageSize]);

  // Connect B2B Order Directly to Stock Out
  const handleFulfillOrder = async (orderId) => {
    try {
      setFulfillingId(orderId);
      await api.post(`/portal/admin/orders/${orderId}/fulfill`);
      toast.success(lang === "no" ? "Ordre fullført! Vareutgang og følgeseddel er opprettet." : "Order fulfilled! Stock deducted & Delivery Note created.");
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || L("Order fulfillment failed", "Ordregjennomføring mislyktes"));
    } finally {
      setFulfillingId(null);
    }
  };

  // Delete B2B Order
  const handleDeleteOrder = async () => {
    if (!selectedOrderToDelete) return;
    try {
      await api.delete(`/portal/admin/orders/${selectedOrderToDelete.id}`);
      toast.success(lang === "no" ? "Ordre slettet fra databasen" : "Order deleted from database");
      setDeleteModalOpen(false);
      setSelectedOrderToDelete(null);
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || L("Failed to delete order", "Kunne ikke slette ordre"));
    }
  };

  const openDeleteModal = (order) => {
    setSelectedOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const L = (en, no) => (lang === "no" ? no : en);

  // Generate Delivery Note PDF (Pakkeseddel)
  const generateDeliveryNotePdf = async (order) => {
    try {
      const doc = new jsPDF();
      const dnNumber = order.deliveryNote?.deliveryNoteNumber || `DN-${order.orderNumber}`;

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 40, "F");

      const logo = await loadPdfLogo();
      if (logo) doc.addImage(logo, "PNG", 12, 5, 30, 30);
      const headX = logo ? 48 : 14;

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("NORDIC PROWEAR AS", headX, 18);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(L("ELECTRONIC DELIVERY NOTE / PAKKESEDDEL 3.0", "ELEKTRONISK PAKKESEDDEL 3.0"), headX, 26);
      doc.text(`${L("Document Ref", "Dokumentref.")}: ${dnNumber}`, headX, 33);

      doc.text(`${L("Issue Date", "Utstedt")}: ${new Date().toLocaleDateString(lang === "no" ? "nb-NO" : undefined)}`, 140, 18);
      doc.text(`${L("Order Number", "Ordrenummer")}: ${order.orderNumber}`, 140, 26);
      doc.text(`${L("Customer Code", "Kundekode")}: ${order.customer?.customerCode || L("WHOLESALE", "ENGROS")}`, 140, 33);

      // Customer Details Box
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(L("DELIVERY CUSTOMER / MOTTAKER:", "MOTTAKER:"), 14, 52);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${L("Company", "Firma")}: ${order.customer?.companyName || order.customer?.fullName}`, 14, 60);
      doc.text(`${L("Contact Person", "Kontaktperson")}: ${order.customer?.fullName}`, 14, 66);
      doc.text(`${L("Phone", "Telefon")}: ${order.customer?.phoneNumber || L("N/A", "I/T")}`, 14, 72);
      doc.text(`${L("VAT / Org Nr", "MVA / Org.nr")}: ${order.customer?.vatNumber || 'NO 940 029 191'}`, 14, 78);

      // Supplier Info
      doc.setFont("helvetica", "bold");
      doc.text(L("SUPPLIER / AVSENDER:", "AVSENDER:"), 120, 52);
      doc.setFont("helvetica", "normal");
      doc.text("Nordic Prowear AS", 120, 60);
      doc.text("Storgt. 15, 1607 Fredrikstad", 120, 66);
      doc.text(`${L("Org Nr", "Org.nr")}: NO 999 888 777 MVA`, 120, 72);
      doc.text(`${L("Email", "E-post")}: post@nordicprowear.no`, 120, 78);

      // Line items table
      const tableData = (order.orderItems || []).map((it, idx) => [
        idx + 1,
        it.product?.sku || 'NP-ART',
        `${it.product?.productName || L("Garment Article", "Plaggartikkel")} ${it.customNote || it.selectedLogo ? `[${it.customNote || it.selectedLogo}]` : ''}`,
        it.quantity,
        `NOK ${Number(it.unitPrice).toFixed(2)}`,
        `NOK ${Number(it.totalPrice).toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: 88,
        head: [["#", L("SKU / Part ID", "SKU / delenr."), L("Article Description & Logo Customization", "Artikkelbeskrivelse og logotilpasning"), L("Qty", "Ant."), L("Unit Price", "Enhetspris"), L("Total Price", "Totalpris")]],
        body: tableData,
        headStyles: { fillColor: [10, 56, 102] }, // brand navy
        styles: { fontSize: 9 },
      });

      const finalY = (doc).lastAutoTable?.finalY ? (doc).lastAutoTable.finalY + 10 : 150;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text(L("This electronic delivery note complies with EHF Pakkeseddel 3.0 (Peppol BIS Despatch Advice 3.0).", "Denne elektroniske pakkeseddelen er i samsvar med EHF Pakkeseddel 3.0 (Peppol BIS Despatch Advice 3.0)."), 14, finalY + 4);

      doc.save(`DeliveryNote_${dnNumber}.pdf`);
      toast.success(L("Delivery Note PDF downloaded!", "Pakkeseddel (PDF) lastet ned!"));
    } catch (err) {
      toast.error(L("Failed to generate Delivery Note PDF", "Kunne ikke lage pakkeseddel (PDF)"));
    }
  };

  // Download EHF XML Despatch Advice
  const downloadEhfXml = async (order) => {
    try {
      const res = await api.get(`/ehf/orders/${order.id}/despatch-advice`, {
        headers: { Accept: "application/xml" }
      });
      const xmlData = typeof res.data === "string" ? res.data : (res.data?.data?.xml || "");
      const blob = new Blob([xmlData], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EHF_Pakkeseddel_${order.orderNumber}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(L("EHF Pakkeseddel 3.0 XML downloaded!", "EHF Pakkeseddel 3.0 XML lastet ned!"));
    } catch (e) {
      toast.error(L("Failed to download EHF XML", "Kunne ikke laste ned EHF XML"));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title={t("b2bOrders")}
          description={lang === "no" ? "Administrer innkomne B2B-kundeordrer, godkjenn og utfør direkte vareutgang (Stock Out)." : "Manage online B2B customer orders, approve, and perform direct Stock Out fulfillment."}
        />

        {/* Filter Bar */}
        <SurfaceCard className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={lang === "no" ? "Søk ordre, kunde, artikkel, status, beløp, dato..." : "Search order, customer, article, status, amount, date..."}
              className="w-full sm:w-80 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-brand-500 focus:bg-white transition"
            />
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-brand-500 focus:bg-white transition"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              Total B2B Orders: {orders.length}
            </span>
          </div>
        </SurfaceCard>

        {/* Responsive Orders Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-slate-400">Loading B2B customer orders...</div>
        ) : orders.length === 0 ? (
          <SurfaceCard className="p-12 text-center text-xs text-slate-400 font-medium">
            No B2B customer orders found.
          </SurfaceCard>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {orders.map((order) => {
              const isCompleted = order.status === "COMPLETED";

              return (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4"
                >
                  {/* Card Header: Order Number, Status & Total */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-base text-brand-600 tracking-tight">{order.orderNumber}</span>
                        <StatusBadge value={order.status} />
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-medium">
                        <Calendar size={13} />
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Grand Total</span>
                        <span className="text-base font-black text-slate-900 font-mono">
                          NOK {Number(order.totalAmount).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => openDeleteModal(order)}
                        className="rounded-xl border border-red-200 bg-red-50/50 p-2.5 text-red-600 transition hover:bg-red-100 hover:text-red-700 cursor-pointer flex-shrink-0"
                        title={lang === "no" ? "Slett ordre" : "Delete Order"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Customer Info Box */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Building2 size={15} className="text-brand-600 flex-shrink-0" />
                      <span>{order.customer?.companyName || order.customer?.fullName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pl-6">
                      <span>Contact: {order.customer?.fullName}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Phone size={12} /> {order.customer?.phoneNumber}
                      </span>
                    </div>
                  </div>

                  {/* Ordered Articles Table */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Ordered Articles:</span>
                    <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-100">
                          <tr>
                            <th className="p-2.5">Garment Article</th>
                            <th className="p-2.5 text-center">Qty</th>
                            <th className="p-2.5 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                          {order.orderItems?.map((it, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-2.5">
                                <span className="font-bold text-slate-900 block">{it.product?.productName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{it.product?.sku}</span>
                              </td>
                              <td className="p-2.5 text-center font-bold text-brand-700">x{it.quantity}</td>
                              <td className="p-2.5 text-right font-mono font-semibold">NOK {Number(it.totalPrice).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Fulfillment Status & Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {order.deliveryNote ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-2 rounded-xl border border-brand-200 flex items-center gap-1.5">
                          <CheckCircle size={15} />
                          <span>Fulfilled • {order.deliveryNote.deliveryNoteNumber}</span>
                        </span>

                        <button
                          onClick={() => generateDeliveryNotePdf(order)}
                          className="bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-red-500/20 transition active:scale-95"
                        >
                          <FileText size={14} className="text-white" />
                          <span>Download Delivery Note PDF</span>
                        </button>

                        <button
                          onClick={() => downloadEhfXml(order)}
                          className="bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-700 hover:to-brand-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition active:scale-95"
                        >
                          <Download size={14} className="text-white" />
                          <span>EHF XML</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 flex items-center gap-1.5">
                        <span>⚠️ Pending Stock Out Fulfillment</span>
                      </span>
                    )}

                    {!isCompleted && order.status !== "CANCELLED" && (
                      <button
                        onClick={() => handleFulfillOrder(order.id)}
                        disabled={fulfillingId === order.id}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-700 hover:to-brand-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-60"
                      >
                        <Truck size={15} />
                        <span>{fulfillingId === order.id ? "Fulfilling Stock Out..." : "Fulfill & Process Stock Out"}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}

            {/* Reusable Pagination */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
              <Pagination
                currentPage={page}
                totalPages={paginationMeta.totalPages}
                totalItems={paginationMeta.total}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(1);
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                itemLabel="orders"
                itemLabelNo="ordrer"
              />
            </div>
          </div>
        )}

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedOrderToDelete(null);
          }}
          onConfirm={handleDeleteOrder}
          title={lang === "no" ? "Slett B2B-ordre" : "Delete B2B Order"}
          message={
            lang === "no"
              ? `Er du sikker på at du vil slette ordre ${selectedOrderToDelete?.orderNumber}? Denne handlingen kan ikke angres.`
              : `Are you sure you want to delete B2B Order ${selectedOrderToDelete?.orderNumber}? This action cannot be undone.`
          }
        />
      </div>
    </MainLayout>
  );
};

export default B2BOrdersPage;

