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
import {
  STYLE_10099_SYMBOLS,
  STYLE_10101_SYMBOLS,
  STYLE_10109_SYMBOLS,
  STYLE_10121_SYMBOLS,
  STYLE_10122_SYMBOLS,
  STYLE_10123_SYMBOLS,
  STYLE_200123_SYMBOLS,
  STYLE_200124_SYMBOLS,
  DEFAULT_WORKWEAR_SYMBOLS,
  CareIcon,
} from "../../components/products/WashingCareCard";

const PortalCatalogPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const isNo = lang === "no";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});

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

  const norwegianCareFull =
    "Vaskes på 40 °C • Ikke bruk klorblekemiddel • Tørketrommel på lav varme eller lufttørkes • Strykes på lav temperatur (maks 110–150 °C) • Ikke renses (med mindre etiketten tillater det)";

  const englishCareFull =
    "Machine Wash at 40 °C • Do Not Use Chlorine Bleach • Tumble Dry Low Heat or Air Dry • Iron at Low Temperature (Max 110–150 °C) • Do Not Dry Clean (Unless Label Allows)";

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

      {/* Search Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder={
              isNo
                ? "Søk etter artikkel, stilnummer, farge, SKU..."
                : "Search style, article, color, SKU..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition"
          />
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
      ) : (
        /* 🌟 EXPANDED HORIZONTAL ROW CARDS WITH FULL FRONT CARE INSTRUCTIONS */
        <div className="space-y-4">
          {products.map((product) => {
            const qty = quantities[product.id] || 1;
            const inStock = product.stockQuantity > 0;
            const baseStyle =
              product.baseStyleNumber ||
              (product.styleNumber ? product.styleNumber.split("-")[0] : "");
            const garmentImg = resolveProductImageUrl(product.imageUrl, baseStyle, product.color);

            const isStyle10099 =
              String(baseStyle).startsWith("10099") ||
              (product.washingInstructions && (product.washingInstructions.includes("85°C") || product.washingInstructions.includes("85")));

            const isStyle10109 =
              !isStyle10099 &&
              (String(baseStyle).startsWith("10109") ||
                (product.fabric && product.fabric.includes("210") && String(baseStyle).includes("10109")));

            const isStyle10121 =
              !isStyle10099 &&
              !isStyle10109 &&
              (String(baseStyle).startsWith("10121") ||
                (product.fabric && product.fabric.includes("320")));

            const isStyle10122 =
              !isStyle10099 &&
              !isStyle10109 &&
              !isStyle10121 &&
              (String(baseStyle).startsWith("10122") ||
                (product.fabric && product.fabric.includes("Anti Pilling")));

            const isStyle10123 =
              !isStyle10099 &&
              !isStyle10109 &&
              !isStyle10121 &&
              !isStyle10122 &&
              (String(baseStyle).startsWith("10123") ||
                (product.washingInstructions && (product.washingInstructions.includes("tørketromles") || product.washingInstructions.includes("Tåler ikke rens"))));

            const isStyle200123 =
              !isStyle10099 &&
              !isStyle10109 &&
              !isStyle10121 &&
              !isStyle10122 &&
              !isStyle10123 &&
              String(baseStyle).startsWith("200123");

            const isStyle200124 =
              !isStyle10099 &&
              !isStyle10109 &&
              !isStyle10121 &&
              !isStyle10122 &&
              !isStyle10123 &&
              !isStyle200123 &&
              (String(baseStyle).startsWith("200124") ||
                (product.washingInstructions && (product.washingInstructions.includes("75°C") || product.washingInstructions.includes("75"))));

            const isStyle10101 =
              !isStyle10099 &&
              !isStyle10109 &&
              !isStyle10121 &&
              !isStyle10122 &&
              !isStyle10123 &&
              !isStyle200123 &&
              !isStyle200124 &&
              (String(baseStyle).startsWith("10101") ||
                (product.washingInstructions && product.washingInstructions.includes("separat")));

            const symbolsList = isStyle10099
              ? STYLE_10099_SYMBOLS
              : isStyle10109
              ? STYLE_10109_SYMBOLS
              : isStyle10121
              ? STYLE_10121_SYMBOLS
              : isStyle10122
              ? STYLE_10122_SYMBOLS
              : isStyle10123
              ? STYLE_10123_SYMBOLS
              : isStyle200123
              ? STYLE_200123_SYMBOLS
              : isStyle200124
              ? STYLE_200124_SYMBOLS
              : isStyle10101
              ? STYLE_10101_SYMBOLS
              : DEFAULT_WORKWEAR_SYMBOLS;

            const careText = isNo
              ? product.washingInstructions ||
                (isStyle10099
                  ? "Vask 85°C (Industrivask) • Må ikke blekes • Tørketrommel tillatt • Må ikke strykes • Tåler ikke rens"
                  : isStyle10109
                  ? "Vask 75°C • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)"
                  : isStyle10121
                  ? "Vask 40°C • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt"
                  : isStyle10122
                  ? "Vask 40°C • Må ikke tørketromles • Tåler ikke bleking • Strykes ved lav varme • Tåler ikke rens"
                  : isStyle10123
                  ? "Vask 40°C • Må ikke blekes • Må ikke tørketromles • Strykes på lav varme • Tåler ikke rens"
                  : isStyle200123
                  ? "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt (Egnet for industriell vask)"
                  : isStyle200124
                  ? "Vask 75°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt"
                  : isStyle10101
                  ? "Vask 40°C • Vaskes separat • Må ikke blekes • Tørketrommel tillatt • Strykes på middels varme • Profesjonell rens tillatt"
                  : norwegianCareFull)
              : isStyle10099
              ? "Wash 85°C (Industrial Wash) • Do Not Bleach • Tumble Dry Allowed • Do Not Iron • Do Not Dry Clean"
              : isStyle10109
              ? "Wash 75°C • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)"
              : isStyle10121
              ? "Wash 40°C • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed"
              : isStyle10122
              ? "Wash 40°C • Do Not Tumble Dry • Do Not Bleach • Iron Low Heat • Do Not Dry Clean"
              : isStyle10123
              ? "Wash 40°C • Do Not Bleach • Do Not Tumble Dry • Iron Low Heat • Do Not Dry Clean"
              : isStyle200123
              ? "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed (Industrial Wash Suitable)"
              : isStyle200124
              ? "Wash 75°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed"
              : isStyle10101
              ? "Wash 40°C • Wash Separately • Do Not Bleach • Tumble Dry Allowed • Iron Medium Heat • Professional Dry Clean (P) Allowed"
              : englishCareFull;

            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition duration-200 space-y-4 group"
              >
                {/* 1. TOP MAIN ROW: GARMENT PHOTO, PRODUCT INFO & CART ACTIONS */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                  {/* Left Group: Photo + Product Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto min-w-0 flex-1">
                    {/* Compact Crisp Photo Box */}
                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-slate-50 border border-slate-200/80 p-2.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:border-blue-300 transition">
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
                      <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs border border-slate-200 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: getColorHex(product.color) }}
                        />
                        <span>{product.color}</span>
                      </div>
                    </div>

                    {/* Middle Info Block */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      {/* Style No, Brand & Category */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wider uppercase font-mono">
                          Style #{baseStyle}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {product.brand || "Nordic Prowear"}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {product.category?.name || "Apparel"}
                        </span>
                        {product.hasCustomPrice && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <Tag size={10} /> B2B Price
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                        {product.productName}
                      </h3>

                      {/* SKU, Color, Size & Weight Specs */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium pt-0.5">
                        <span className="font-mono text-slate-400">
                          SKU: <strong className="text-slate-700">{product.sku}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          {isNo ? "Farge" : "Color"}: <strong className="text-slate-800">{product.color}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          {isNo ? "Str" : "Size"}: <strong className="text-slate-800">{product.size || "Standard"}</strong>
                        </span>
                        {product.weightInKg && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <Weight size={12} className="text-slate-400" /> {product.weightInKg} kg
                            </span>
                          </>
                        )}
                      </div>

                      {/* Fabric pill */}
                      {product.fabric && (
                        <div className="pt-1">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-semibold text-slate-700 font-mono">
                            {product.fabric}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Group: Price, Stock, Stepper & Add to Cart */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                    {/* Price & Stock */}
                    <div className="text-left lg:text-right">
                      <div className="flex items-baseline lg:justify-end gap-1.5">
                        {product.hasCustomPrice && (
                          <span className="text-xs text-slate-400 line-through font-mono">
                            NOK {Number(product.salePrice).toLocaleString()}
                          </span>
                        )}
                        <span className="text-xl font-black text-slate-900 font-mono">
                          NOK {Number(product.effectivePrice || product.salePrice).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-0.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            inStock
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-rose-50 text-rose-700 border border-rose-200/60"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {inStock
                            ? `${product.stockQuantity} ${isNo ? "på lager" : "in stock"}`
                            : isNo
                            ? "Utsolgt"
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Add Button */}
                    <div className="flex items-center gap-2">
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

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 px-5 text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      >
                        <ShoppingCart size={14} />
                        <span>{t("addToCart") || "Add to Cart"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. 🌟 BOTTOM SECTION: FULL FRONT WASHING CARE INSTRUCTIONS BLOCK */}
                <div className="pt-3 border-t border-slate-100/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-blue-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {isNo ? "Vaskeanvisning & Tekstilpleie" : "Washing & Textile Care"}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold font-mono">
                        {isStyle200124 ? "Style #200124" : isStyle10101 ? "Style #10101" : "ISO 3758"}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {isNo ? "Nordiske Standarder" : "Nordic Standards"}
                    </span>
                  </div>

                  {/* VECTOR CARE SYMBOL TILES (FULL ROW - 6 TILES FOR 10101, 5 FOR WORKWEAR) */}
                  <div
                    className={`grid gap-2.5 ${
                      symbolsList.length === 6
                        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
                        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
                    }`}
                  >
                    {symbolsList.map((s) => {
                      const isProhibited = s.status === "prohibited";
                      const isWarning = s.status === "warning";

                      return (
                        <div
                          key={s.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                            isProhibited
                              ? "bg-rose-50/30 border-rose-100"
                              : isWarning
                              ? "bg-amber-50/30 border-amber-100"
                              : "bg-slate-50/60 border-slate-200/70"
                          }`}
                        >
                          <div className="p-1 rounded-lg bg-white border border-slate-100 shadow-2xs shrink-0 flex items-center justify-center">
                            <CareIcon type={s.iconType} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-slate-800 leading-tight truncate">
                              {isNo ? s.titleNo : s.titleEn}
                            </p>
                            <p className="text-[9px] text-slate-500 leading-tight truncate">
                              {isNo ? s.descNo : s.descEn}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* FULL CARE TEXT LINE */}
                  <div className="p-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-start sm:items-center gap-2">
                      <strong className="text-slate-900 shrink-0">
                        {isNo ? "Full Tekst:" : "Full Care Text:"}
                      </strong>
                      <span className="text-slate-600 leading-relaxed">{careText}</span>
                    </div>

                    {product.fabric && (
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-800 font-mono self-start sm:self-auto">
                        {product.fabric}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortalCatalogPage;
