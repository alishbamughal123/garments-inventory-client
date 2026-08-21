import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import StatusBadge from "../../components/ui/StatusBadge";
import { Clock, Printer, Package, CheckCircle, Weight, FileText } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import logo from "../../assets/logo.png";

const PortalOrdersPage = () => {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePdfOrder, setActivePdfOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });

  const fetchOrders = async (pageToFetch = page, pageSizeToFetch = pageSize) => {
    try {
      setLoading(true);
      const res = await api.get("/portal/orders/my", {
        params: {
          page: pageToFetch,
          limit: pageSizeToFetch,
        },
      });
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
      toast.error(lang === "no" ? "Kunne ikke laste ordrehistorikk" : "Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, pageSize);
  }, [page, pageSize]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-200 pb-3 sm:pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Clock className="text-teal-600 shrink-0" size={24} />
          <span>{t("orderHistory") || "Order History"}</span>
        </h1>
        <span className="text-[11px] sm:text-xs font-bold text-slate-600 bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 shadow-xs">
          {orders.length} {lang === "no" ? "Ordrer" : "Orders"}
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-slate-400">Loading order history...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-slate-500 text-xs sm:text-sm font-medium shadow-xs">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          {lang === "no" ? "Ingen tidligere bestillinger funnet for din konto." : "No past orders found for your account."}
        </div>
      ) : (
        <div className="space-y-3.5 sm:space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 sm:gap-4 hover:shadow-md transition"
            >
              <div className="space-y-1 sm:space-y-1.5 w-full sm:w-auto">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-mono font-black text-sm sm:text-base text-teal-600">{order.orderNumber}</span>
                  <StatusBadge value={order.status} />
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {lang === "no" ? "Bestilt" : "Placed on"} {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems?.length || 0} {lang === "no" ? "artikler" : "items"}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs pt-0.5">
                  <span className="text-slate-700 flex items-center gap-1 font-semibold">
                    <Weight size={12} className="text-indigo-600 shrink-0" /> {order.totalParcelWeight?.toFixed(2)} kg
                  </span>
                  {order.deliveryNote && (
                    <span className="text-emerald-600 font-mono font-bold text-[10px] sm:text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      DN: {order.deliveryNote.deliveryNoteNumber}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  NOK {Number(order.totalAmount).toLocaleString()}
                </span>

                <button
                  onClick={() => setActivePdfOrder(order)}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  <Printer size={13} />
                  <span>{lang === "no" ? "Kvittering" : "PDF Receipt"}</span>
                </button>
              </div>
            </div>
          ))}

          {/* Reusable Pagination */}
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs overflow-x-auto">
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

      {/* PDF ORDER CONFIRMATION MODAL */}
      {activePdfOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                B2B Order Confirmation PDF
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setActivePdfOrder(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6 border border-slate-200 rounded-xl space-y-4 sm:space-y-6 bg-white print:border-none print:p-0">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3 sm:pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <img src={logo} alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
                    <span className="text-sm sm:text-lg font-black tracking-tight uppercase text-slate-900">
                      Nordic Prowear AS
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">Oslo, Norway • B2B Sales Division</p>
                </div>
                <div className="text-right">
                  <h2 className="text-sm sm:text-xl font-black text-teal-700 uppercase tracking-tight">
                    {t("orderConfirmation") || "CONFIRMATION"}
                  </h2>
                  <p className="text-xs font-mono font-bold text-slate-800">{activePdfOrder.orderNumber}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">
                    {new Date(activePdfOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activePdfOrder.orderItems?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-semibold text-slate-900">
                          {it.product?.productName} ({it.product?.sku})
                        </td>
                        <td className="p-2 text-center font-bold">{it.quantity}</td>
                        <td className="p-2 text-right font-mono">NOK {Number(it.unitPrice).toLocaleString()}</td>
                        <td className="p-2 text-right font-bold font-mono">NOK {Number(it.totalPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 sm:p-4 bg-teal-50/60 rounded-xl border border-teal-100 text-xs flex justify-between items-center gap-2">
                <div>
                  <p className="font-bold text-teal-900 text-[11px] sm:text-xs">Shipment Parcel Weight:</p>
                  <p className="text-slate-600 text-[10px]">
                    Garment: {activePdfOrder.garmentWeightKg} kg + Box: {activePdfOrder.packagingWeightKg} kg
                  </p>
                </div>
                <span className="font-mono text-xs sm:text-base font-extrabold text-teal-800 shrink-0">
                  {activePdfOrder.totalParcelWeight} kg
                </span>
              </div>

              <div className="pt-1 text-right text-xs space-y-0.5">
                <p className="text-slate-500">
                  Subtotal: <span className="font-mono font-bold text-slate-900">NOK {Number(activePdfOrder.subtotal).toLocaleString()}</span>
                </p>
                <p className="text-slate-500">
                  VAT (25% MVA): <span className="font-mono font-bold text-slate-900">NOK {Number(activePdfOrder.tax).toLocaleString()}</span>
                </p>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Total: <span className="font-mono text-teal-700">NOK {Number(activePdfOrder.totalAmount).toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalOrdersPage;
