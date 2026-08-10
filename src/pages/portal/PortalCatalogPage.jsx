import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/useAuth";
import { Search, ShoppingCart, Tag, Weight, Check, AlertCircle, Package } from "lucide-react";

const PortalCatalogPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await api.get("/portal/catalog", {
        params: { search, customerId: user?.id }
      });
      setProducts(res.data.data || []);
    } catch {
      toast.error(lang === "no" ? "Kunne ikke laste katalog" : "Failed to load product catalog");
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
    const existingIndex = cart.findIndex(i => i.productId === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        productId: product.id,
        product,
        unitPrice: product.effectivePrice,
        quantity: qty
      });
    }

    localStorage.setItem("b2b_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart_updated"));
    toast.success(lang === "no" ? `Lagt til ${qty} stk i handlekurven!` : `Added ${qty} items to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-[11px] font-bold text-teal-300 uppercase tracking-widest bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700/80 inline-flex items-center gap-1">
            <Package size={13} /> {t("b2bCatalog")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {lang === "no" ? "Eksklusiv B2B Produktkatalog" : "Exclusive B2B Garment Catalogue"}
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder={t("searchProduct")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-slate-400">Loading catalog...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const qty = quantities[product.id] || 1;
            const inStock = product.stockQuantity > 0;

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

                  {/* Title & Specs */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition leading-snug">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {product.sku}</p>

                  <div className="my-4 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-medium">Color / Size:</span>
                      <span className="font-bold text-slate-800">{product.color} / {product.size || "OS"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">{t("weightPerArticle")}:</span>
                      <span className="font-bold text-blue-600 flex items-center gap-1">
                        <Weight size={12} /> {product.weightInKg ? `${product.weightInKg} kg` : t("missingWeightBadge")}
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
                      <span className="text-lg font-black text-emerald-600 font-mono">
                        NOK {Number(product.effectivePrice).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {inStock ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min="1"
                        max={product.stockQuantity}
                        value={qty}
                        onChange={(e) => handleQtyChange(product.id, e.target.value)}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-2 text-center text-xs font-bold text-slate-900 outline-none focus:border-teal-500 focus:bg-white"
                      />
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition active:scale-95"
                      >
                        <ShoppingCart size={15} />
                        <span>{t("addToCart")}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-center text-xs font-bold text-red-600 flex items-center justify-center gap-1.5">
                      <AlertCircle size={15} />
                      <span>Out of Stock</span>
                    </div>
                  )}
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
