import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/useAuth";
import { ShoppingCart, Trash2, Weight, AlertTriangle, CheckCircle, Printer, FileText } from "lucide-react";
import logo from "../../assets/logo.png";

const PortalCartPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [packagingWeightKg, setPackagingWeightKg] = useState(0.2);
  const [submitting, setSubmitting] = useState(false);

  // Order Confirmation Printable Modal
  const [activeConfirmation, setActiveConfirmation] = useState(null);

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem("b2b_cart") || "[]");
    setCart(items);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQty = (productId, newQty) => {
    const qty = Math.max(1, parseInt(newQty) || 1);
    const updated = cart.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: qty };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("b2b_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const handleRemove = (productId) => {
    const updated = cart.filter(i => i.productId !== productId);
    setCart(updated);
    localStorage.setItem("b2b_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
    toast.success("Item removed from cart");
  };

  // Weight Calculations (Task 5)
  const totalGarmentWeight = cart.reduce((sum, item) => {
    const wt = Number(item.product.weightInKg || 0);
    return sum + (wt * item.quantity);
  }, 0);

  const totalParcelWeight = totalGarmentWeight + Number(packagingWeightKg || 0);

  const hasMissingWeights = cart.some(item => !item.product.weightInKg || Number(item.product.weightInKg) === 0);

  // Financial Calculations
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.unitPrice) * item.quantity), 0);
  const taxMva = subtotal * 0.25; // 25% MVA
  const grandTotal = subtotal + taxMva;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        items: cart.map(i => ({
          productId: i.productId,
          quantity: i.quantity
        })),
        shippingAddress,
        notes: orderNotes,
        packagingWeightKg: Number(packagingWeightKg)
      };

      const res = await api.post("/portal/orders/place", payload);
      const order = res.data.data.order;

      toast.success(lang === "no" ? "B2B-bestilling registrert i CRM!" : "B2B Order placed successfully inside CRM!");

      // Clear cart
      localStorage.removeItem("b2b_cart");
      window.dispatchEvent(new Event("cart_updated"));

      // Open Automatic Order Confirmation Modal
      setActiveConfirmation(order);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Order placement failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <ShoppingCart className="text-teal-600" size={26} />
          <span>{t("cartSummary")}</span>
        </h1>
        <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          {cart.length} unique articles
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Your shopping cart is currently empty.</p>
          <button
            onClick={() => navigate("/portal/catalog")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            Browse Catalogue
          </button>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          
          {/* LEFT 2 COLUMNS: ITEMS TABLE & SHIPPING DETAILS */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Article</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-center">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {cart.map((item) => (
                    <tr key={item.productId} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 font-bold text-slate-900">
                        {item.product.productName}
                        <span className="block text-[10px] text-slate-400 font-mono font-medium">{item.product.sku} ({item.product.color} / {item.product.size || "OS"})</span>
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQty(item.productId, e.target.value)}
                          className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1 text-center font-bold text-slate-900 outline-none focus:border-teal-500 focus:bg-white"
                        />
                      </td>
                      <td className="p-3 text-right text-slate-600 font-semibold">NOK {Number(item.unitPrice).toLocaleString()}</td>
                      <td className="p-3 text-right font-black text-emerald-600">NOK {(Number(item.unitPrice) * item.quantity).toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleRemove(item.productId)} className="text-red-500 hover:text-red-700 transition">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Delivery Address & Notes */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Delivery Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t("shippingAddress")}</label>
                  <textarea
                    placeholder="Enter delivery address..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t("orderNotes")}</label>
                  <textarea
                    placeholder="PO number or order notes..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PARCEL WEIGHT CALCULATOR & SUMMARY */}
          <div className="space-y-6">
            
            {/* Task 5 Parcel Weight Calculator */}
            <div className="bg-white border border-indigo-100 rounded-3xl p-5 space-y-4 shadow-md">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Weight className="text-indigo-600" size={18} />
                <span>{t("parcelWeightCalculator")}</span>
              </h3>

              {hasMissingWeights && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold flex items-start gap-2">
                  <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                  <span>{t("weightMissingAlert")}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">{t("garmentWeightKg")}</span>
                  <span className="font-bold text-slate-900 font-mono">{totalGarmentWeight.toFixed(2)} kg</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">{t("packagingWeightKg")}</span>
                  <input
                    type="number"
                    step="0.05"
                    value={packagingWeightKg}
                    onChange={(e) => setPackagingWeightKg(e.target.value)}
                    className="w-20 bg-white border border-slate-200 rounded-lg p-1 text-right font-bold text-teal-600 outline-none"
                  />
                </div>

                <div className="flex justify-between items-center p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900">
                  <span className="font-bold">{t("estimatedParcelWeight")}</span>
                  <span className="font-mono text-base font-black text-indigo-700">{totalParcelWeight.toFixed(2)} kg</span>
                </div>
              </div>
            </div>

            {/* Financial Totals Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-md">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Payment Summary</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{t("subtotal")}</span>
                  <span className="font-mono font-bold text-slate-900">NOK {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{t("taxMva")}</span>
                  <span className="font-mono font-bold text-slate-900">NOK {taxMva.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-emerald-600 pt-3 border-t border-slate-100">
                  <span>{t("totalAmount")}</span>
                  <span className="font-mono text-base">NOK {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition disabled:opacity-60"
              >
                {submitting ? "Placing Order..." : t("placeOrder")}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* AUTOMATIC PDF ORDER CONFIRMATION MODAL */}
      {activeConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto font-sans">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle size={20} />
                <span>{t("orderConfirmation")} Created</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-700 transition"
                >
                  <Printer size={15} />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={() => {
                    setActiveConfirmation(null);
                    navigate("/portal/orders");
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  Done
                </button>
              </div>
            </div>

            {/* Printable Document */}
            <div className="p-6 border border-slate-200 rounded-xl space-y-6 bg-white print:border-none print:p-0">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                    <span className="text-lg font-black tracking-tight text-slate-900 uppercase">Nordic Prowear AS</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Oslo, Norway • B2B Sales Division</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-black text-teal-700 uppercase tracking-tight">{t("orderConfirmation")}</h2>
                  <p className="text-xs font-mono font-bold text-slate-800">{activeConfirmation.orderNumber}</p>
                  <p className="text-[11px] text-slate-500">Date: {new Date(activeConfirmation.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CUSTOMER DETAILS:</span>
                <p className="font-bold text-sm text-slate-900">{activeConfirmation.customer?.companyName || activeConfirmation.customer?.fullName}</p>
                <p className="text-slate-600">{activeConfirmation.customer?.fullName} • {activeConfirmation.customer?.email}</p>
                <p className="text-slate-600">Shipping: {activeConfirmation.shippingAddress || "Default Address"}</p>
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
                  {activeConfirmation.orderItems?.map((it, idx) => (
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
                  <p className="font-bold text-teal-900">Estimated Shipment Parcel Weight:</p>
                  <p className="text-slate-600 text-[11px]">Garment: {activeConfirmation.garmentWeightKg} kg + Packaging: {activeConfirmation.packagingWeightKg} kg</p>
                </div>
                <span className="font-mono text-base font-extrabold text-teal-800">{activeConfirmation.totalParcelWeight} kg</span>
              </div>

              <div className="pt-2 text-right text-xs space-y-1">
                <p className="text-slate-500">Subtotal: <span className="font-mono font-bold text-slate-900">NOK {Number(activeConfirmation.subtotal).toLocaleString()}</span></p>
                <p className="text-slate-500">VAT (25% MVA): <span className="font-mono font-bold text-slate-900">NOK {Number(activeConfirmation.tax).toLocaleString()}</span></p>
                <p className="text-sm font-extrabold text-slate-900">Total: <span className="font-mono text-teal-700">NOK {Number(activeConfirmation.totalAmount).toLocaleString()}</span></p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PortalCartPage;
