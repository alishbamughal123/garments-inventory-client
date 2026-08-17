import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/useAuth";
import {
  Search,
  ShoppingCart,
  Tag,
  Weight,
  Check,
  AlertCircle,
  Package,
  ShieldCheck,
  Info,
  X,
  Plus,
  Minus,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { resolveProductImageUrl, getColorHex } from "../../utils/imageHelper";
import WashingCareCard from "../../components/products/WashingCareCard";

/**
 * Compact SVG Care Icon for Horizontal Cards
 */
const MiniCareIcon = ({ type }) => {
  switch (type) {
    case "wash40":
      return (
        <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 16 L10 38 Q10 42 14 42 L34 42 Q38 42 38 38 L42 16" />
          <path d="M6 19 Q12 15 18 19 T30 19 T42 19" strokeWidth="2" strokeDasharray="1 0" />
          <text x="24" y="33" textAnchor="middle" fill="currentColor" stroke="none" className="text-[11px] font-extrabold font-mono" style={{ fill: "#1e293b" }}>40°</text>
        </svg>
      );
    case "noBleach":
      return (
        <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-rose-600 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="24,8 6,40 42,40" />
          <line x1="12" y1="18" x2="36" y2="38" className="stroke-rose-600" strokeWidth="2.5" />
          <line x1="36" y1="18" x2="12" y2="38" className="stroke-rose-600" strokeWidth="2.5" />
        </svg>
      );
    case "tumbleLow":
      return (
        <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-amber-600 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="8" width="32" height="32" rx="4" />
          <circle cx="24" cy="24" r="12" />
          <circle cx="24" cy="24" r="2.5" className="fill-amber-600 stroke-none" />
        </svg>
      );
    case "ironLow":
      return (
        <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-slate-800 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 36 L40 36 C42 36 43 34 41 30 C37 22 28 20 22 20 L10 20 C8 20 8 26 8 36 Z" />
          <path d="M12 20 L12 14 C12 12 14 10 16 10 L34 10" />
          <circle cx="24" cy="28" r="2" className="fill-slate-800 stroke-none" />
        </svg>
      );
    case "noDryClean":
      return (
        <svg viewBox="0 0 48 48" className="w-5 h-5 stroke-rose-600 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="24" r="16" />
          <line x1="12" y1="12" x2="36" y2="36" className="stroke-rose-600" strokeWidth="2.5" />
          <line x1="36" y1="12" x2="12" y2="36" className="stroke-rose-600" strokeWidth="2.5" />
        </svg>
      );
    default:
      return <ShieldCheck className="w-5 h-5 text-blue-600" />;
  }
};

const PortalCatalogPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const isNo = lang === "no";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});
  const [activeCareModalProduct, setActiveCareModalProduct] = useState(null);
  const [viewMode, setViewMode] = useState("rows"); // 'rows' (horizontal cards) | 'grid'

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await api.get("/portal/catalog", {
        params: { search, customerId: user?.id },
      });
      setProducts(res.data.data || []);
    } catch {
      toast.error(
        isNo ? "Kunne ikke laste katalog" : "Failed to load product catalog"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCatalog, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleQtyChange = (productId, val) => {
    const num = Math.max(1, parseInt(val) || 1);
    setQuantities({ ...quantities, [productId]: num });
  };

  const handleIncrement = (productId, maxStock = 9999) => {
    const current = quantities[productId] || 1;
    if (current < maxStock) {
      setQuantities({ ...quantities, [productId]: current + 1 });
    }
  };

  const handleDecrement = (productId) => {
    const current = quantities[productId] || 1;
    if (current > 1) {
      setQuantities({ ...quantities, [productId]: current - 1 });
    }
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1;

    if (qty > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} items in stock`);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("b2b_cart") || "[]");
    const existingIndex = cart.findIndex((i) => i.productId === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        productId: product.id,
        product,
        unitPrice: product.effectivePrice || product.salePrice,
        quantity: qty,
      });
    }

    localStorage.setItem("b2b_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart_updated"));
    toast.success(
      isNo
        ? `Lagt til ${qty} stk i handlekurven!`
        : `Added ${qty} items to cart!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest bg-blue-900/60 px-3 py-1 rounded-full border border-blue-700/80 inline-flex items-center gap-1">
            <Package size={13} /> {t("b2bCatalog")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isNo
              ? "Eksklusiv B2B Produktkatalog"
              : "Exclusive B2B Garment Catalogue"}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {isNo
              ? "Priser og produktutvalg er tilpasset din bedriftsavtale med Nordic Prowear."
              : "Prices and article visibility are tailored to your agreed corporate pricing with Nordic Prowear."}
          </p>
        </div>
      </div>

      {/* Search & View Mode Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder={isNo ? "Søk etter artikkel, stilnummer, farge, SKU..." : "Search style, article, color, SKU..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>

        {/* View Layout Toggle (Row Cards vs Grid) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("rows")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === "rows"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Horizontal Row Cards (1 per row)"
          >
            <LayoutList size={14} />
            <span>{isNo ? "Rader" : "Rows"}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Grid Cards"
          >
            <LayoutGrid size={14} />
            <span>{isNo ? "Rutenett" : "Grid"}</span>
          </button>
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="p-16 text-center text-xs font-semibold text-slate-400 bg-white rounded-2xl border border-slate-100">
          Loading B2B catalog items...
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-100 space-y-2">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No articles found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search keywords.</p>
        </div>
      ) : viewMode === "rows" ? (
        /* 🌟 HORIZONTAL LANDSCAPE CARDS (1 ROW PER ARTICLE - CLEAN & COMPACT) */
        <div className="space-y-3.5">
          {products.map((product) => {
            const qty = quantities[product.id] || 1;
            const inStock = product.stockQuantity > 0;
            const baseStyle =
              product.baseStyleNumber ||
              (product.styleNumber ? product.styleNumber.split("-")[0] : "");
            const garmentImg = resolveProductImageUrl(product.imageUrl, baseStyle);

            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:shadow-md hover:border-slate-300 transition duration-200 group"
              >
                {/* 1. LEFT: COMPACT GARMENT PHOTO */}
                <div className="flex items-center gap-4 w-full md:w-auto min-w-0">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:border-blue-300 transition">
                    <img
                      src={garmentImg}
                      alt={product.productName}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/uploads/placeholders/default-article.svg";
                      }}
                    />

                    {/* Color Swatch Dot Tag */}
                    <div className="absolute bottom-1.5 left-1.5 bg-white/95 backdrop-blur-xs border border-slate-200 px-2 py-0.5 rounded-lg text-[10px] font-semibold text-slate-700 shadow-2xs flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: getColorHex(product.color) }}
                      />
                      <span>{product.color}</span>
                    </div>
                  </div>

                  {/* 2. MIDDLE: ARTICLE DETAILS & BUILT-IN VECTOR CARE SYMBOLS */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Style No & Category Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wider uppercase font-mono">
                        Style #{baseStyle}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {product.category?.name || "Garment"}
                      </span>
                      {product.hasCustomPrice && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Tag size={10} /> B2B Price
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                      {product.productName}
                    </h3>

                    {/* SKU, Color, Size & Fabric Info */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
                      <span className="font-mono text-slate-400">SKU: <strong className="text-slate-700">{product.sku}</strong></span>
                      <span>•</span>
                      <span>{isNo ? "Farge" : "Color"}: <strong className="text-slate-800">{product.color}</strong></span>
                      <span>•</span>
                      <span>{isNo ? "Str" : "Size"}: <strong className="text-slate-800">{product.size || "Standard"}</strong></span>
                      {product.fabric && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 font-mono text-[11px] truncate max-w-xs">{product.fabric}</span>
                        </>
                      )}
                    </div>

                    {/* 🌟 VECTOR WASHING CARE SYMBOLS ROW (FRONT & CENTER) */}
                    <div
                      onClick={() => setActiveCareModalProduct(product)}
                      className="pt-1 flex items-center gap-2 cursor-pointer group/care"
                      title={isNo ? "Klikk for å se full vaskeanvisning" : "Click to view full care label"}
                    >
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-1 px-2 hover:bg-blue-50/70 hover:border-blue-200 transition">
                        <MiniCareIcon type="wash40" />
                        <MiniCareIcon type="noBleach" />
                        <MiniCareIcon type="tumbleLow" />
                        <MiniCareIcon type="ironLow" />
                        <MiniCareIcon type="noDryClean" />
                        <span className="ml-1.5 text-[10px] font-bold text-blue-700 hidden sm:inline">
                          {isNo ? "40°C • Ikke klorblek • Lav tørk • Lav stryk • Ikke rens" : "40°C • No Bleach • Tumble Low • Iron Low • No Dry Clean"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. RIGHT: PRICING, STOCK, QUANTITY STEPPER & ADD TO CART */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  {/* Pricing & Stock */}
                  <div className="text-left md:text-right">
                    <div className="flex items-baseline md:justify-end gap-1.5">
                      {product.hasCustomPrice && (
                        <span className="text-xs text-slate-400 line-through font-mono">
                          NOK {Number(product.salePrice).toLocaleString()}
                        </span>
                      )}
                      <span className="text-lg font-black text-slate-900 font-mono">
                        NOK {Number(product.effectivePrice || product.salePrice).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-0.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inStock
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-rose-50 text-rose-700 border border-rose-200/60"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {inStock ? `${product.stockQuantity} ${isNo ? "på lager" : "in stock"}` : isNo ? "Utsolgt" : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Add Button */}
                  <div className="flex items-center gap-2">
                    {/* Stepper */}
                    <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
                      <button
                        type="button"
                        onClick={() => handleDecrement(product.id)}
                        disabled={!inStock || qty <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 transition"
                      >
                        <Minus size={13} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stockQuantity || 1}
                        value={qty}
                        onChange={(e) => handleQtyChange(product.id, e.target.value)}
                        disabled={!inStock}
                        className="w-10 bg-transparent text-center text-xs font-bold text-slate-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleIncrement(product.id, product.stockQuantity)}
                        disabled={!inStock || qty >= product.stockQuantity}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 transition"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Add Button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={!inStock}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-4 text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <ShoppingCart size={13} />
                      <span>{t("addToCart") || "Add"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GRID VIEW MODE */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const qty = quantities[product.id] || 1;
            const inStock = product.stockQuantity > 0;
            const baseStyle =
              product.baseStyleNumber ||
              (product.styleNumber ? product.styleNumber.split("-")[0] : "");
            const garmentImg = resolveProductImageUrl(product.imageUrl, baseStyle);

            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full uppercase">
                      {product.category?.name || "Garment"}
                    </span>
                    {product.hasCustomPrice && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Tag size={12} /> B2B Price
                      </span>
                    )}
                  </div>

                  <div className="relative group/img bg-slate-50 rounded-2xl overflow-hidden h-48 border border-slate-200/80 flex items-center justify-center p-3 text-center my-3">
                    <img
                      src={garmentImg}
                      alt={product.productName}
                      className="max-h-full max-w-full object-contain group-hover/img:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/uploads/placeholders/default-article.svg";
                      }}
                    />
                    <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-medium text-slate-700 shadow-xs flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: getColorHex(product.color) }}
                      />
                      <span className="font-bold">{product.color}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {product.sku}</p>

                  {/* Vector Care Icons */}
                  <div
                    onClick={() => setActiveCareModalProduct(product)}
                    className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-1">
                      <MiniCareIcon type="wash40" />
                      <MiniCareIcon type="noBleach" />
                      <MiniCareIcon type="tumbleLow" />
                      <MiniCareIcon type="ironLow" />
                      <MiniCareIcon type="noDryClean" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-700">ISO 3758</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3 mt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-medium">Unit Price:</span>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 font-mono">
                        NOK {Number(product.effectivePrice || product.salePrice).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity || 1}
                      value={qty}
                      onChange={(e) => handleQtyChange(product.id, e.target.value)}
                      disabled={!inStock}
                      className="w-16 bg-slate-50 border border-slate-200 rounded-xl py-2 px-2 text-center text-xs font-bold text-slate-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={!inStock}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 px-4 text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <ShoppingCart size={14} />
                      <span>{t("addToCart") || "Add"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POPUP MODAL FOR CRISP NORWEGIAN CARE LABEL */}
      {activeCareModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeCareModalProduct.productName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Style #{activeCareModalProduct.baseStyleNumber || activeCareModalProduct.sku} • {activeCareModalProduct.color}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveCareModalProduct(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Render Vector Care Card */}
            <WashingCareCard
              fabric={activeCareModalProduct.fabric}
              customInstructions={activeCareModalProduct.washingInstructions}
              brand={activeCareModalProduct.brand || "Nordic Prowear"}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveCareModalProduct(null)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2 text-xs font-semibold shadow-sm transition"
              >
                {isNo ? "Lukk" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalCatalogPage;
