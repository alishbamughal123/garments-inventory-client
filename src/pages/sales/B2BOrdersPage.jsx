import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { CheckCircle, Truck, Package, Weight, Clock, Building2, Phone, Calendar, FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const B2BOrdersPage = () => {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [fulfillingId, setFulfillingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/portal/admin/orders", {
        params: { status: statusFilter }
      });
      setOrders(res.data.data || []);
    } catch {
      toast.error(lang === "no" ? "Kunne ikke laste B2B-ordrer" : "Failed to load B2B orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Connect B2B Order Directly to Stock Out
  const handleFulfillOrder = async (orderId) => {
    try {
      setFulfillingId(orderId);
      await api.post(`/portal/admin/orders/${orderId}/fulfill`);
      toast.success(lang === "no" ? "Ordre fullført! Vareutgang og følgeseddel er opprettet." : "Order fulfilled! Stock deducted & Delivery Note created.");
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Order fulfillment failed");
    } finally {
      setFulfillingId(null);
    }
  };

  // Generate Delivery Note PDF (Pakkeseddel)
  const generateDeliveryNotePdf = (order) => {
    try {
      const doc = new jsPDF();
      const dnNumber = order.deliveryNote?.deliveryNoteNumber || `DN-${order.orderNumber}`;

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("NORDIC PROWEAR AS", 14, 18);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("ELECTRONIC DELIVERY NOTE / PAKKESEDDEL 3.0", 14, 26);
      doc.text(`Document Ref: ${dnNumber}`, 14, 33);

      doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 140, 18);
      doc.text(`Order Number: ${order.orderNumber}`, 140, 26);
      doc.text(`Customer Code: ${order.customer?.customerCode || 'WHOLESALE'}`, 140, 33);

      // Customer Details Box
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("DELIVERY CUSTOMER / MOTTAKER:", 14, 52);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Company: ${order.customer?.companyName || order.customer?.fullName}`, 14, 60);
      doc.text(`Contact Person: ${order.customer?.fullName}`, 14, 66);
      doc.text(`Phone: ${order.customer?.phoneNumber || 'N/A'}`, 14, 72);
      doc.text(`VAT / Org Nr: ${order.customer?.vatNumber || 'NO 940 029 191'}`, 14, 78);

      // Supplier Info
      doc.setFont("helvetica", "bold");
      doc.text("SUPPLIER / AVSENDER:", 120, 52);
      doc.setFont("helvetica", "normal");
      doc.text("Nordic Prowear AS", 120, 60);
      doc.text("Storgt. 15, 1607 Fredrikstad", 120, 66);
      doc.text("Org Nr: NO 999 888 777 MVA", 120, 72);
      doc.text("Email: post@nordicprowear.no", 120, 78);

      // Line items table
      const tableData = (order.orderItems || []).map((it, idx) => [
        idx + 1,
        it.product?.sku || 'NP-ART',
        `${it.product?.productName || 'Garment Article'} ${it.customNote || it.selectedLogo ? `[${it.customNote || it.selectedLogo}]` : ''}`,
        it.quantity,
        `NOK ${Number(it.unitPrice).toFixed(2)}`,
        `NOK ${Number(it.totalPrice).toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: 88,
        head: [["#", "SKU / Part ID", "Article Description & Logo Customization", "Qty", "Unit Price", "Total Price"]],
        body: tableData,
        headStyles: { fillColor: [13, 148, 136] }, // teal-600
        styles: { fontSize: 9 },
      });

      const finalY = (doc).lastAutoTable?.finalY ? (doc).lastAutoTable.finalY + 10 : 150;

      // Parcel Weight & EHF Summary
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("PARCEL & SHIPMENT WEIGHT SUMMARY:", 14, finalY);
      doc.setFont("helvetica", "normal");
      doc.text(`• Total Parcel Weight: ${order.totalParcelWeight?.toFixed(2) || '0.20'} kg`, 14, finalY + 7);
      doc.text(`• Garment Net Weight: ${order.garmentWeightKg?.toFixed(2) || '0.00'} kg`, 14, finalY + 13);
      doc.text(`• Packaging Weight: ${order.packagingWeightKg?.toFixed(2) || '0.20'} kg`, 14, finalY + 19);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("This electronic delivery note complies with EHF Pakkeseddel 3.0 (Peppol BIS Despatch Advice 3.0).", 14, finalY + 30);

      doc.save(`DeliveryNote_${dnNumber}.pdf`);
      toast.success("Delivery Note PDF downloaded!");
    } catch (err) {
      toast.error("Failed to generate Delivery Note PDF");
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
      toast.success("EHF Pakkeseddel 3.0 XML downloaded!");
    } catch (e) {
      toast.error("Failed to download EHF XML");
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
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition"
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
                        <span className="font-mono font-black text-base text-teal-600 tracking-tight">{order.orderNumber}</span>
                        <StatusBadge value={order.status} />
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-medium">
                        <Calendar size={13} />
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-100 w-full sm:w-auto">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Grand Total</span>
                      <span className="text-base font-black text-slate-900 font-mono">
                        NOK {Number(order.totalAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info Box */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Building2 size={15} className="text-teal-600 flex-shrink-0" />
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
                              <td className="p-2.5 text-center font-bold text-teal-700">x{it.quantity}</td>
                              <td className="p-2.5 text-right font-mono font-semibold">NOK {Number(it.totalPrice).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Parcel Weight Info Box (Task 5) */}
                  <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 space-y-2 text-xs text-indigo-950">
                    <div className="flex items-center justify-between font-bold border-b border-indigo-100 pb-2">
                      <span className="flex items-center gap-1.5 text-indigo-900">
                        <Weight size={15} className="text-indigo-600" />
                        <span>Shipment Parcel Weight Info:</span>
                      </span>
                      <span className="font-mono text-sm font-black text-indigo-700">{order.totalParcelWeight?.toFixed(2)} kg</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                      <div>Garment Weight: <span className="font-bold text-slate-800">{order.garmentWeightKg?.toFixed(2)} kg</span></div>
                      <div>Packaging Weight: <span className="font-bold text-slate-800">{order.packagingWeightKg?.toFixed(2)} kg</span></div>
                    </div>
                  </div>

                  {/* Fulfillment Status & Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {order.deliveryNote ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle size={15} />
                          <span>Fulfilled • {order.deliveryNote.deliveryNoteNumber}</span>
                        </span>

                        <button
                          onClick={() => generateDeliveryNotePdf(order)}
                          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-red-500/20 transition active:scale-95"
                        >
                          <FileText size={14} className="text-white" />
                          <span>Download Delivery Note PDF</span>
                        </button>

                        <button
                          onClick={() => downloadEhfXml(order)}
                          className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition active:scale-95"
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
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-60"
                      >
                        <Truck size={15} />
                        <span>{fulfillingId === order.id ? "Fulfilling Stock Out..." : "Fulfill & Process Stock Out"}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default B2BOrdersPage;

