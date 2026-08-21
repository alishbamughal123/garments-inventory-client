import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/logo.png";
import {
  ShoppingBag,
  ShoppingCart,
  Clock,
  LogOut,
  Globe,
  Shield,
  User,
  Package,
} from "lucide-react";

const B2BPortalLayout = () => {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItemsCount, setCartItemsCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("b2b_cart") || "[]");
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemsCount(count);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cart_updated", updateCartCount);
    return () => window.removeEventListener("cart_updated", updateCartCount);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top B2B Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/90 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo & Portal Badge */}
          <Link to="/portal/catalog" className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 p-1 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center shadow-xs">
              <img src={logo} alt="Nordic Prowear Logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xs sm:text-sm tracking-tight text-slate-900 uppercase block leading-tight">
                Nordic Prowear
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-teal-600 tracking-wider uppercase leading-none">
                B2B Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links - Desktop & Tablet */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-xs font-bold">
            <Link
              to="/portal/catalog"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                location.pathname === "/portal/catalog"
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Package size={16} />
              <span>{t("b2bCatalog") || "Catalogue"}</span>
            </Link>

            <Link
              to="/portal/orders"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                location.pathname === "/portal/orders"
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Clock size={16} />
              <span>{t("myOrders") || "My Orders"}</span>
            </Link>

            <Link
              to="/portal/cart"
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                location.pathname === "/portal/cart"
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <ShoppingCart size={16} />
              <span>{t("cart") || "Cart"}</span>
              {cartItemsCount > 0 && (
                <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-1.5 py-0.2 min-w-[18px] h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Actions: Language Switcher, User & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language dropdown */}
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold">
              <Globe size={13} className="text-blue-600 shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-slate-800 outline-none cursor-pointer"
                aria-label="Select Language"
              >
                <option value="en">EN</option>
                <option value="no">NO</option>
              </select>
            </div>

            {/* Desktop User Info */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <div className="h-7.5 w-7.5 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center border border-teal-200 text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
              </div>
              <div className="max-w-[120px] truncate">
                <p className="font-bold text-slate-900 text-xs truncate leading-tight">{user?.name}</p>
                <p className="text-[9px] text-slate-500 font-medium truncate">{user?.companyName || "B2B Client"}</p>
              </div>
            </div>

            {/* Mobile Cart Button with count */}
            <Link
              to="/portal/cart"
              className={`md:hidden relative p-2 rounded-xl transition ${
                location.pathname === "/portal/cart"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              title="Cart"
            >
              <ShoppingCart size={18} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-extrabold text-[9px] h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-slate-100 transition"
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (Fixed for quick 1-thumb touch navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200/90 backdrop-blur-lg shadow-lg px-2 py-1.5 flex items-center justify-around">
        <Link
          to="/portal/catalog"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            location.pathname === "/portal/catalog"
              ? "text-teal-600 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Package size={20} />
          <span className="text-[10px] leading-tight">{t("b2bCatalog") || "Catalogue"}</span>
        </Link>

        <Link
          to="/portal/orders"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            location.pathname === "/portal/orders"
              ? "text-teal-600 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Clock size={20} />
          <span className="text-[10px] leading-tight">{t("myOrders") || "My Orders"}</span>
        </Link>

        <Link
          to="/portal/cart"
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            location.pathname === "/portal/cart"
              ? "text-teal-600 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <div className="relative">
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-emerald-500 text-white font-extrabold text-[9px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-xs">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight">{t("cart") || "Cart"}</span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Nordic Prowear B2B Customer Portal. All rights reserved.</span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <Shield size={14} /> Encrypted SSL Portal
          </span>
        </div>
      </footer>
    </div>
  );
};

export default B2BPortalLayout;
