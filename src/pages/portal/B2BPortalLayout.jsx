import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/logo.png";
import {
  ShoppingBag, ShoppingCart, Clock, LogOut, Globe, Shield, User, Package
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top B2B Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/90 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Portal Badge */}
          <Link to="/portal/catalog" className="flex items-center gap-3">
            <div className="h-10 w-10 p-1 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center shadow-sm">
              <img src={logo} alt="Nordic Prowear Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-slate-900 uppercase block leading-none">Nordic Prowear</span>
              <span className="text-[10px] font-bold text-teal-600 tracking-wider uppercase">B2B Customer Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
            <Link
              to="/portal/catalog"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                location.pathname === "/portal/catalog"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Package size={16} />
              <span>{t("b2bCatalog")}</span>
            </Link>

            <Link
              to="/portal/orders"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                location.pathname === "/portal/orders"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Clock size={16} />
              <span>{t("myOrders")}</span>
            </Link>

            <Link
              to="/portal/cart"
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                location.pathname === "/portal/cart"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <ShoppingCart size={16} />
              <span>{t("cart")}</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-extrabold text-[10px] h-5 w-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </nav>

          {/* User Profile & Language Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold">
              <Globe size={14} className="text-blue-600" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="no">NO</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center border border-teal-200">
                {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
              </div>
              <div>
                <p className="font-bold text-slate-900 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{user?.companyName || "B2B Client"}</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-slate-100 transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
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
