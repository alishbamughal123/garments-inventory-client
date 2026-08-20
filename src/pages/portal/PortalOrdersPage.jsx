import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import StatusBadge from "../../components/ui/StatusBadge";
import { Clock, Printer, Package, CheckCircle, Weight } from "lucide-react";
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
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, pageSize);
  }, [page, pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <Clock className="text-teal-600" size={26} />
          <span>{t("orderHistory")}</span>
        </h1>
        <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          {orders.length} Orders
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-slate-400">Loading order history...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 text-xs font-medium shadow-sm">
          No past orders found for your account.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-base text-teal-600">{order.orderNumber}</span>
                  <StatusBadge value={order.status} />
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems?.length || 0} unique items
                </p>
                <div className="flex items-center gap-4 text-xs pt-1">
                  <span className="text-slate-700 flex items-center gap-1 font-semibold">
                    <Weight size={13} className="text-indigo-600" /> Parcel Weight: {order.totalParcelWeight?.toFixed(2)} kg
                  </span>
                  {order.deliveryNote && (
                    <span className="text-emerald-600 font-mono font-bold">
                      Delivery Note: {order.deliveryNote.deliveryNoteNumber}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <span className="text-lg font-black text-slate-900 font-mono">
                  NOK {Number(order.totalAmount).toLocaleString()}
                </span>

                <button
                  onClick={() => setActivePdfOrder(order)}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Printer size={14} />
                  <span>PDF Receipt</span>
                </button>
              </div>
            </div>
          ))}

          {/* Reusable Pagination */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">B2B Order Confirmation PDF Document</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-700 transition"
                >
                  <Printer size={15} />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={() => setActivePdfOrder(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl space-y-6 bg-white print:border-none print:p-0">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                    <span className="text-lg font-black tracking-tight uppercase text-slate-900">Nordic Prowear AS</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Oslo, Norway • B2B Sales Division</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-black text-teal-700 uppercase tracking-tight">{t("orderConfirmation")}</h2>
                  <p className="text-xs font-mono font-bold text-slate-800">{activePdfOrder.orderNumber}</p>
                  <p className="text-[11px] text-slate-500">Date: {new Date(activePdfOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

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
                      <td className="p-2 font-semibold text-slate-900">{it.product?.productName} ({it.product?.sku})</td>
                      <td className="p-2 text-center font-bold">{it.quantity}</td>
                      <td className="p-2 text-right">NOK {Number(it.unitPrice).toLocaleString()}</td>
                      <td className="p-2 text-right font-bold">NOK {Number(it.totalPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100 text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-teal-900">Shipment Parcel Weight:</p>
                  <p className="text-slate-600 text-[11px]">Garment: {activePdfOrder.garmentWeightKg} kg + Packaging: {activePdfOrder.packagingWeightKg} kg</p>
                </div>
                <span className="font-mono text-base font-extrabold text-teal-800">{activePdfOrder.totalParcelWeight} kg</span>
              </div>

              <div className="pt-2 text-right text-xs space-y-1">
                <p className="text-slate-500">Subtotal: <span className="font-mono font-bold text-slate-900">NOK {Number(activePdfOrder.subtotal).toLocaleString()}</span></p>
                <p className="text-slate-500">VAT (25% MVA): <span className="font-mono font-bold text-slate-900">NOK {Number(activePdfOrder.tax).toLocaleString()}</span></p>
                <p className="text-sm font-extrabold text-slate-900">Total: <span className="font-mono text-teal-700">NOK {Number(activePdfOrder.totalAmount).toLocaleString()}</span></p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PortalOrdersPage;
