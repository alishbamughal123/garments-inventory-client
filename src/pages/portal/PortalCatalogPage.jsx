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
} from "lucide-react";
import { resolveProductImageUrl, getColorHex } from "../../utils/imageHelper";
import WashingCareCard from "../../components/products/WashingCareCard";

const PortalCatalogPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});
  const [activeCareModalProduct, setActiveCareModalProduct] = useState(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await api.get("/portal/catalog", {
        params: { search, customerId: user?.id },
      });
      setProducts(res.data.data || []);
    } catch {
      toast.error(
        lang === "no" ? "Kunne ikke laste katalog" : "Failed to load product catalog"
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
        unitPrice: product.effectivePrice,
        quantity: qty,
      });
    }

    localStorage.setItem("b2b_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart_updated"));
    toast.success(
      lang === "no"
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
            {lang === "no"
              ? "Eksklusiv B2B Produktkatalog"
              : "Exclusive B2B Garment Catalogue"}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {lang === "no"
              ? "Priser og produktutvalg er tilpasset din bedriftsavtale med Nordic Prowear."
              : "Prices and article visibility are tailored to your agreed corporate pricing with Nordic Prowear."}
          </p>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder={t("searchProduct") || "Search style, article, color..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-slate-400">
          Loading catalog...
        </div>
      ) : (
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
                  {/* Category & Custom Price Badge */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full uppercase">
                      {product.category?.name || "Garment"}
                    </span>

                    {product.hasCustomPrice && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Tag size={12} /> B2B Agreed Price
                      </span>
                    )}
                  </div>

                  {/* PROMINENT GARMENT PHOTO CONTAINER */}
                  <div className="relative group/img bg-slate-50/80 rounded-2xl overflow-hidden h-52 border border-slate-200/80 flex items-center justify-center p-3 text-center my-3">
                    <img
                      src={garmentImg}
                      alt={product.productName}
                      className="max-h-full max-w-full object-contain group-hover/img:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/uploads/placeholders/default-article.svg";
                      }}
                    />

                    {/* Color Swatch Pill overlay */}
                    <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-medium text-slate-700 shadow-xs flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: getColorHex(product.color) }}
                      />
                      <span className="font-bold">{product.color}</span>
                    </div>

                    {/* Stock Status Pill */}
                    <span
                      className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inStock
                          ? "bg-emerald-100/90 text-emerald-800 border border-emerald-200"
                          : "bg-rose-100/90 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
                    </span>
                  </div>

                  {/* Title & Specs */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    SKU: {product.sku}
                  </p>

                  {/* 🌟 CRISP VECTOR WASHING CARE MINI BAR (ISO 3758) */}
                  <div
                    onClick={() => setActiveCareModalProduct(product)}
                    className="mt-3 p-2.5 rounded-2xl bg-blue-50/50 border border-blue-100/80 hover:bg-blue-100/60 transition cursor-pointer flex items-center justify-between gap-2 group/care"
                    title="Click to view full Norwegian ISO 3758 care instructions"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                      <div className="text-[11px] leading-tight">
                        <span className="font-bold text-slate-800">
                          {lang === "no" ? "Vaskeanvisning: " : "Care Label: "}
                        </span>
                        <span className="text-slate-600">
                          {product.washingInstructions ||
                            "Vaskes på 40 °C • Ikke klorblek • Lav tørk"}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-lg shrink-0 group-hover/care:bg-blue-600 group-hover/care:text-white transition">
                      {lang === "no" ? "Se Symboler" : "View ISO"}
                    </span>
                  </div>

                  {/* Color / Size & Weight info */}
                  <div className="my-3 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-medium">Color / Size:</span>
                      <span className="font-bold text-slate-800">
                        {product.color} / {product.size || "OS"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">
                        {t("weightPerArticle") || "Weight"}:
                      </span>
                      <span className="font-bold text-blue-600 flex items-center gap-1">
                        <Weight size={12} />{" "}
                        {product.weightInKg
                          ? `${product.weightInKg} kg`
                          : t("missingWeightBadge") || "Standard"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Cart Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-medium">Unit Price:</span>
                    <div className="text-right">
                      {product.hasCustomPrice && (
                        <span className="text-xs text-slate-400 line-through mr-2 font-medium">
                          NOK {Number(product.salePrice).toLocaleString()}
                        </span>
                      )}
                      <span className="text-lg font-black text-slate-900 font-mono">
                        NOK {Number(product.effectivePrice || product.salePrice).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Add Button */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity || 1}
                      value={qty}
                      onChange={(e) => handleQtyChange(product.id, e.target.value)}
                      disabled={!inStock}
                      className="w-16 bg-slate-50 border border-slate-200 rounded-xl py-2 px-2 text-center text-xs font-bold text-slate-900 outline-none focus:border-blue-500 disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={!inStock}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 px-4 text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={14} />
                      <span>{t("addToCart") || "Add to Cart"}</span>
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
                {lang === "no" ? "Lukk" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalCatalogPage;
