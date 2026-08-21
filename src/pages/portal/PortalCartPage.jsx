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
  Building,
  MapPin,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
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
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-200 pb-3 sm:pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <ShoppingCart className="text-teal-600 shrink-0" size={24} />
          <span>{t("cartSummary") || "Shopping Cart"}</span>
        </h1>
        <span className="text-[11px] sm:text-xs font-bold text-slate-600 bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 shadow-xs">
          {cart.length} {lang === "no" ? "artikler" : "articles"}
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            {lang === "no" ? "Handlekurven din er for øyeblikket tom." : "Your shopping cart is currently empty."}
          </p>
          <button
            onClick={() => navigate("/portal/catalog")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
          >
            {lang === "no" ? "Bla i katalogen" : "Browse Catalogue"}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
          {/* LEFT 2 COLUMNS: ITEMS LIST & CUSTOMER / SHIPPING DETAILS */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            
            {/* 1. CUSTOMER IDENTITY & PRE-FILLED ADDRESS INFO CARD */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md relative overflow-hidden space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="p-1.5 sm:p-2 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300">
                    <Building size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-100 uppercase">
                      {lang === "no" ? "Kundeopplysninger for ordre" : "Customer Order Information"}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400">
                      {lang === "no"
                        ? "Navn og adresse hentes automatisk og kan overstyres nedenfor."
                        : "Name and address auto-populate automatically and can be modified below."}
                    </p>
                  </div>
                </div>

                <span className="text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-900/60 border border-teal-700 text-teal-300 font-mono inline-flex items-center gap-1 self-start sm:self-auto">
                  <Sparkles size={10} />
                  {isStaff ? "Staff Mode" : "Auto Profile"}
                </span>
              </div>

              {/* Staff Dropdown Selector OR B2B Customer Info Card */}
              {isStaff ? (
                <div className="space-y-1.5">
                  <label className="block text-[11px] sm:text-xs font-bold text-teal-300 uppercase tracking-wider">
                    {lang === "no" ? "Velg B2B-Konto / Bedrift:" : "Select Customer Account:"}
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerDropdownChange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl py-2.5 px-3 sm:py-3 sm:px-4 text-xs font-bold text-white outline-none focus:border-teal-400 cursor-pointer transition shadow-inner"
                  >
                    {customersList.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.companyName || c.fullName} • {c.fullName} ({c.customerCode || "CUST"})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                currentCustomer && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 bg-slate-800/80 border border-slate-700 p-3 rounded-xl sm:rounded-2xl text-xs">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase block">Company:</span>
                      <strong className="text-slate-100 font-semibold text-xs">{currentCustomer.companyName || "Nordic Partner"}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase block">Contact Person:</span>
                      <strong className="text-slate-100 font-semibold text-xs">{currentCustomer.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase block">Account Code:</span>
                      <strong className="text-teal-300 font-mono font-bold text-xs">{currentCustomer.customerCode || "B2B-CLIENT"}</strong>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* 2. CART ITEMS CONTAINER: MOBILE CARDS & DESKTOP TABLE */}
            
            {/* Mobile View: Clean Card List (<640px) */}
            <div className="block sm:hidden space-y-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-2.5"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {item.product?.productName}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono font-medium">
                        SKU: {item.product?.sku} • {item.product?.color} / {item.product?.size || "OS"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 transition"
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQty(item.productId, e.target.value)}
                        className="w-9 bg-transparent text-center text-xs font-bold text-slate-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 transition"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">
                        NOK {Number(item.unitPrice).toLocaleString()} / stk
                      </span>
                      <strong className="text-sm font-black text-emerald-600 font-mono">
                        NOK {(Number(item.unitPrice) * item.quantity).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet View: Table (>=640px) */}
            <div className="hidden sm:block bg-white border border-slate-200 rounded-3xl p-5 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
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
                        <td className="p-3 text-right text-slate-600 font-semibold font-mono">
                          NOK {Number(item.unitPrice).toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-black text-emerald-600 font-mono">
                          NOK {(Number(item.unitPrice) * item.quantity).toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="text-red-500 hover:text-red-700 transition cursor-pointer p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. AUTO-POPULATED BUT FULLY EDITABLE SHIPPING ADDRESS & NOTES */}
            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-xs">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-2.5 sm:pb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-teal-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {lang === "no" ? "Leveringsadresse & Notater" : "Delivery Details & Shipping Address"}
                  </h3>
                </div>

                {defaultProfileAddress && (
                  <button
                    type="button"
                    onClick={handleResetAddress}
                    className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-teal-600 hover:text-teal-800 hover:underline transition cursor-pointer"
                  >
                    <RotateCcw size={11} />
                    <span>{lang === "no" ? "Bruk profiladresse" : "Use profile default"}</span>
                  </button>
                )}
              </div>

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700">
                      {t("shippingAddress") || "Shipping Address"} <span className="text-slate-400 font-normal">({lang === "no" ? "Kan endres" : "Editable"})</span>
                    </label>
                  </div>
                  <textarea
                    placeholder="Enter delivery address..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1">
                    {lang === "no"
                      ? "Adressen er forhåndsutfylt fra kundekortet. Du kan fritt redigere den."
                      : "Address pre-filled from customer file. You can freely edit or update it."}
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    {t("orderNotes") || "Order Notes"} <span className="text-slate-400 font-normal">({lang === "no" ? "Valgfritt" : "Optional"})</span>
                  </label>
                  <textarea
                    placeholder="PO number, department, internal memo..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PARCEL WEIGHT CALCULATOR & SUMMARY */}
          <div className="space-y-4 sm:space-y-6">
            {/* Parcel Weight Calculator */}
            <div className="bg-white border border-indigo-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5 sm:pb-3">
                <Weight className="text-indigo-600 shrink-0" size={16} />
                <span>{t("parcelWeightCalculator") || "Parcel Weight Calculator"}</span>
              </h3>

              {hasMissingWeights && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] sm:text-xs text-amber-800 font-semibold flex items-start gap-1.5">
                  <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={15} />
                  <span>{t("weightMissingAlert") || "Some items lack weight specifications."}</span>
                </div>
              )}

              <div className="space-y-2 sm:space-y-3 text-xs">
                <div className="flex justify-between items-center p-2 sm:p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium text-[11px] sm:text-xs">{t("garmentWeightKg") || "Garment Weight"}</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">{totalGarmentWeight.toFixed(2)} kg</span>
                </div>

                <div className="flex justify-between items-center p-2 sm:p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium text-[11px] sm:text-xs">{t("packagingWeightKg") || "Packaging Box"}</span>
                  <input
                    type="number"
                    step="0.05"
                    value={packagingWeightKg}
                    onChange={(e) => setPackagingWeightKg(e.target.value)}
                    className="w-18 bg-white border border-slate-200 rounded-lg p-1 text-right font-bold text-teal-600 outline-none text-xs"
                  />
                </div>

                <div className="flex justify-between items-center p-2.5 sm:p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900">
                  <span className="font-bold text-[11px] sm:text-xs">{t("estimatedParcelWeight") || "Est. Total Parcel"}</span>
                  <span className="font-mono text-sm sm:text-base font-black text-indigo-700">
                    {totalParcelWeight.toFixed(2)} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Totals Card */}
            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 sm:pb-3">
                {lang === "no" ? "Betalingsoversikt" : "Payment Summary"}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{t("subtotal") || "Subtotal"}</span>
                  <span className="font-mono font-bold text-slate-900">
                    NOK {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{t("taxMva") || "VAT (25% MVA)"}</span>
                  <span className="font-mono font-bold text-slate-900">
                    NOK {taxMva.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-xs sm:text-sm font-black text-emerald-600 pt-2.5 border-t border-slate-100">
                  <span>{t("totalAmount") || "Grand Total"}</span>
                  <span className="font-mono text-sm sm:text-base">NOK {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition disabled:opacity-60 cursor-pointer active:scale-98"
              >
                {submitting ? "Placing Order..." : (t("placeOrder") || "Place B2B Order")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTOMATIC PDF ORDER CONFIRMATION MODAL */}
      {activeConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs sm:text-sm">
                <CheckCircle size={18} />
                <span>{t("orderConfirmation") || "Order Confirmation"} Created</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 bg-teal-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => {
                    setActiveConfirmation(null);
                    navigate("/portal/orders");
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>

            {/* Printable Document */}
            <div className="p-3 sm:p-6 border border-slate-200 rounded-xl space-y-4 sm:space-y-6 bg-white print:border-none print:p-0">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3 sm:pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <img src={logo} alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
                    <span className="text-sm sm:text-lg font-black tracking-tight text-slate-900 uppercase">
                      Nordic Prowear AS
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">Oslo, Norway • B2B Division</p>
                </div>
                <div className="text-right">
                  <h2 className="text-sm sm:text-xl font-black text-teal-700 uppercase tracking-tight">
                    {t("orderConfirmation") || "CONFIRMATION"}
                  </h2>
                  <p className="text-xs font-mono font-bold text-slate-800">
                    {activeConfirmation.orderNumber}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">
                    {new Date(activeConfirmation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-0.5">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CUSTOMER & DELIVERY:
                </span>
                <p className="font-bold text-xs sm:text-sm text-slate-900">
                  {activeConfirmation.customer?.companyName || activeConfirmation.customer?.fullName}
                </p>
                <p className="text-slate-600 text-[11px]">
                  {activeConfirmation.customer?.fullName} • {activeConfirmation.customer?.email}
                </p>
                <p className="text-slate-800 font-semibold text-[11px] pt-1">
                  Delivery: {activeConfirmation.shippingAddress || "Registered Address"}
                </p>
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
                    {activeConfirmation.orderItems?.map((it, idx) => (
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
                  <p className="font-bold text-teal-900 text-[11px] sm:text-xs">Est. Parcel Weight:</p>
                  <p className="text-slate-600 text-[10px]">
                    Garment: {activeConfirmation.garmentWeightKg} kg + Box: {activeConfirmation.packagingWeightKg} kg
                  </p>
                </div>
                <span className="font-mono text-xs sm:text-base font-extrabold text-teal-800 shrink-0">
                  {activeConfirmation.totalParcelWeight} kg
                </span>
              </div>

              <div className="pt-1 text-right text-xs space-y-0.5">
                <p className="text-slate-500">
                  Subtotal: <span className="font-mono font-bold text-slate-900">NOK {Number(activeConfirmation.subtotal).toLocaleString()}</span>
                </p>
                <p className="text-slate-500">
                  VAT (25%): <span className="font-mono font-bold text-slate-900">NOK {Number(activeConfirmation.tax).toLocaleString()}</span>
                </p>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
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
