import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/useAuth";
import {
  ShoppingCart,
  Trash2,
  Weight,
  AlertTriangle,
  CheckCircle,
  Printer,
  FileText,
  User,
  Building,
  MapPin,
  RotateCcw,
  Sparkles
} from "lucide-react";
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

  // Customer & Profile state
  const [profileLoading, setProfileLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [defaultProfileAddress, setDefaultProfileAddress] = useState("");

  // Order Confirmation Printable Modal
  const [activeConfirmation, setActiveConfirmation] = useState(null);

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem("b2b_cart") || "[]");
    setCart(items);
  };

  const fetchProfileAndAddress = async () => {
    try {
      setProfileLoading(true);
      const res = await api.get("/portal/profile");
      const data = res.data.data;

      if (data?.isStaff) {
        setIsStaff(true);
        const list = data.customers || [];
        setCustomersList(list);

        if (list.length > 0) {
          const first = list[0];
          setSelectedCustomerId(first.id);
          setCurrentCustomer(first);
          const addr = first.fullAddress || first.address || "";
          setDefaultProfileAddress(addr);
          setShippingAddress((prev) => (prev ? prev : addr));
        }
      } else if (data?.customer) {
        setIsStaff(false);
        const cust = data.customer;
        setCurrentCustomer(cust);
        setSelectedCustomerId(cust.id);
        const addr = cust.fullAddress || cust.address || "";
        setDefaultProfileAddress(addr);
        setShippingAddress((prev) => (prev ? prev : addr));
      }
    } catch (err) {
      console.warn("Could not fetch customer profile:", err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    fetchProfileAndAddress();
  }, []);

  const handleCustomerDropdownChange = (customerId) => {
    setSelectedCustomerId(customerId);
    const found = customersList.find((c) => c.id === customerId);
    if (found) {
      setCurrentCustomer(found);
      const addr = found.fullAddress || found.address || "";
      setDefaultProfileAddress(addr);
      setShippingAddress(addr);
      toast.success(
        lang === "no"
          ? `Valgt kunde: ${found.companyName || found.fullName}`
          : `Selected customer: ${found.companyName || found.fullName}`,
        { icon: "🏢" }
      );
    }
  };

  const handleResetAddress = () => {
    if (defaultProfileAddress) {
      setShippingAddress(defaultProfileAddress);
      toast.success(
        lang === "no"
          ? "Tilbakestilt til profiladresse"
          : "Reset to registered profile address"
      );
    }
  };

  const handleUpdateQty = (productId, newQty) => {
    const qty = Math.max(1, parseInt(newQty, 10) || 1);
    const updated = cart.map((item) => {
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
    const updated = cart.filter((i) => i.productId !== productId);
    setCart(updated);
    localStorage.setItem("b2b_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
    toast.success(lang === "no" ? "Vare fjernet fra handlekurv" : "Item removed from cart");
  };

  // Weight Calculations
  const totalGarmentWeight = cart.reduce((sum, item) => {
    const wt = Number(item.product?.weightInKg || 0);
    return sum + wt * item.quantity;
  }, 0);

  const totalParcelWeight = totalGarmentWeight + Number(packagingWeightKg || 0);
  const hasMissingWeights = cart.some(
    (item) => !item.product?.weightInKg || Number(item.product?.weightInKg) === 0
  );

  // Financial Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );
  const taxMva = subtotal * 0.25; // 25% MVA
  const grandTotal = subtotal + taxMva;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error(lang === "no" ? "Handlekurven din er tom" : "Your cart is empty");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        items: cart.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          selectedLogo: i.selectedLogo,
          customNote: i.customNote
        })),
        targetCustomerId: selectedCustomerId || undefined,
        shippingAddress: shippingAddress.trim(),
        notes: orderNotes.trim(),
        packagingWeightKg: Number(packagingWeightKg)
      };

      const res = await api.post("/portal/orders/place", payload);
      const order = res.data.data.order;

      toast.success(
        lang === "no"
          ? "B2B-bestilling registrert i CRM!"
          : "B2B Order placed successfully inside CRM!"
      );

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
          <p className="text-slate-500 text-sm font-medium">
            Your shopping cart is currently empty.
          </p>
          <button
            onClick={() => navigate("/portal/catalog")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            Browse Catalogue
          </button>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          {/* LEFT 2 COLUMNS: ITEMS TABLE & CUSTOMER / SHIPPING DETAILS */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* 1. CUSTOMER IDENTITY & PRE-FILLED ADDRESS INFO CARD */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300">
                    <Building size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-slate-100 uppercase">
                      {lang === "no" ? "Kundeopplysninger for ordre" : "Customer Order Information"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {lang === "no"
                        ? "Navn og adresse hentes automatisk og kan overstyres nedenfor."
                        : "Name and address auto-populate automatically and can be modified below."}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-teal-900/60 border border-teal-700 text-teal-300 font-mono inline-flex items-center gap-1.5">
                  <Sparkles size={11} />
                  {isStaff ? "Staff Admin Mode" : "Auto-Fetched Profile"}
                </span>
              </div>

              {/* Staff Dropdown Selector OR B2B Customer Info Card */}
              {isStaff ? (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-teal-300 uppercase tracking-wider">
                    {lang === "no" ? "Velg B2B-Konto / Bedrift (Rullegardin):" : "Select Customer Account (Dropdown):"}
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerDropdownChange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-teal-400 cursor-pointer transition shadow-inner"
                  >
                    {customersList.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.companyName || c.fullName} • {c.fullName} ({c.customerCode || "CUST"}) — {c.address || c.city || "No stored address"}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                currentCustomer && (
                  <div className="grid sm:grid-cols-3 gap-3 bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Company:</span>
                      <strong className="text-slate-100 font-semibold">{currentCustomer.companyName || "Nordic Partner"}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact Person:</span>
                      <strong className="text-slate-100 font-semibold">{currentCustomer.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Account Code:</span>
                      <strong className="text-teal-300 font-mono font-bold">{currentCustomer.customerCode || "B2B-CLIENT"}</strong>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* 2. CART ITEMS TABLE */}
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
                        {item.product?.productName}
                        <span className="block text-[10px] text-slate-400 font-mono font-medium">
                          {item.product?.sku} ({item.product?.color} / {item.product?.size || "OS"})
                        </span>
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
                      <td className="p-3 text-right text-slate-600 font-semibold">
                        NOK {Number(item.unitPrice).toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-black text-emerald-600">
                        NOK {(Number(item.unitPrice) * item.quantity).toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3. AUTO-POPULATED BUT FULLY EDITABLE SHIPPING ADDRESS & NOTES */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {lang === "no" ? "Leveringsadresse & Notater" : "Delivery Details & Shipping Address"}
                  </h3>
                </div>

                {defaultProfileAddress && (
                  <button
                    type="button"
                    onClick={handleResetAddress}
                    className="flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-800 hover:underline transition"
                  >
                    <RotateCcw size={12} />
                    <span>{lang === "no" ? "Bruk profiladresse" : "Use profile default"}</span>
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {t("shippingAddress")} <span className="text-slate-400 font-normal">({lang === "no" ? "Automatisk utfylt • Kan endres" : "Auto-filled • Editable"})</span>
                    </label>
                  </div>
                  <textarea
                    placeholder="Enter delivery address..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {lang === "no"
                      ? "Adressen er forhåndsutfylt fra kundekortet. Du kan fritt redigere den."
                      : "Address pre-filled from customer file. You can freely edit or update it."}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t("orderNotes")} <span className="text-slate-400 font-normal">({lang === "no" ? "Valgfritt" : "Optional"})</span>
                  </label>
                  <textarea
                    placeholder="PO number, department, internal memo..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PARCEL WEIGHT CALCULATOR & SUMMARY */}
          <div className="space-y-6">
            {/* Parcel Weight Calculator */}
            <div className="bg-white border border-indigo-100 rounded-3xl p-5 space-y-4 shadow-md">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Weight className="text-indigo-600" size={18} />
                <span>{t("parcelWeightCalculator")}</span>
              </h3>

              {hasMissingWeights && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold flex items-start gap-2">
                  <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
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
                  <span className="font-mono text-base font-black text-indigo-700">
                    {totalParcelWeight.toFixed(2)} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Totals Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-md">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Payment Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{t("subtotal")}</span>
                  <span className="font-mono font-bold text-slate-900">
                    NOK {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{t("taxMva")}</span>
                  <span className="font-mono font-bold text-slate-900">
                    NOK {taxMva.toLocaleString()}
                  </span>
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
                    <span className="text-lg font-black tracking-tight text-slate-900 uppercase">
                      Nordic Prowear AS
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Oslo, Norway • B2B Sales Division</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-black text-teal-700 uppercase tracking-tight">
                    {t("orderConfirmation")}
                  </h2>
                  <p className="text-xs font-mono font-bold text-slate-800">
                    {activeConfirmation.orderNumber}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Date: {new Date(activeConfirmation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CUSTOMER & DELIVERY DETAILS:
                </span>
                <p className="font-bold text-sm text-slate-900">
                  {activeConfirmation.customer?.companyName || activeConfirmation.customer?.fullName}
                </p>
                <p className="text-slate-600">
                  Contact: {activeConfirmation.customer?.fullName} • {activeConfirmation.customer?.email}
                </p>
                <p className="text-slate-800 font-semibold pt-1">
                  Delivery Address: {activeConfirmation.shippingAddress || "Default Registered Address"}
                </p>
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
                      <td className="p-2 font-semibold text-slate-900">
                        {it.product?.productName} ({it.product?.sku})
                      </td>
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
                  <p className="text-slate-600 text-[11px]">
                    Garment: {activeConfirmation.garmentWeightKg} kg + Packaging: {activeConfirmation.packagingWeightKg} kg
                  </p>
                </div>
                <span className="font-mono text-base font-extrabold text-teal-800">
                  {activeConfirmation.totalParcelWeight} kg
                </span>
              </div>

              <div className="pt-2 text-right text-xs space-y-1">
                <p className="text-slate-500">
                  Subtotal: <span className="font-mono font-bold text-slate-900">NOK {Number(activeConfirmation.subtotal).toLocaleString()}</span>
                </p>
                <p className="text-slate-500">
                  VAT (25% MVA): <span className="font-mono font-bold text-slate-900">NOK {Number(activeConfirmation.tax).toLocaleString()}</span>
                </p>
                <p className="text-sm font-extrabold text-slate-900">
                  Total: <span className="font-mono text-teal-700">NOK {Number(activeConfirmation.totalAmount).toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalCartPage;

