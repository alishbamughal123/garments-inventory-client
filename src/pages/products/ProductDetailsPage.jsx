import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  FileSpreadsheet,
  Printer,
  Tag,
  Edit,
  Layers,
  Check,
  Package,
  ShieldCheck,
  Sparkles,
  Barcode,
  ArrowRight,
  Info as InfoIcon,
} from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import Loader from "../../components/ui/Loader";
import BarcodePrintModal from "../../components/products/BarcodePrintModal";
import {
  getProductById,
  getPriceHistory,
  getProducts,
} from "../../services/products.service";
import { exportArticlesToExcelWithBarcodes } from "../../utils/barcodeExport";
import { resolveProductImageUrl, resolveWashingImageUrl, getColorHex } from "../../utils/imageHelper";
import WashingCareCard from "../../components/products/WashingCareCard";
import toast from "react-hot-toast";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState(id);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [productRes, historyRes, allProductsRes] = await Promise.all([
          getProductById(id),
          getPriceHistory(id).catch(() => ({ data: [] })),
          getProducts().catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          const productData = productRes.data;
          setProduct(productData);
          setSelectedVariantId(productData.id);
          setSelectedColor(productData.color || "");
          setPriceHistory(historyRes?.data || []);

          const baseStyle =
            productData.baseStyleNumber ||
            (productData.styleNumber ? productData.styleNumber.split("-")[0] : null);

          const siblings = (allProductsRes.data || []).filter((p) => {
            const pBase =
              p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : null);
            return (
              (baseStyle && pBase === baseStyle) ||
              (p.styleName && productData.styleName && p.styleName === productData.styleName)
            );
          });

          const variantList = siblings.length > 0 ? siblings : [productData];
          setAllVariants(variantList);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading || !product) {
    return (
      <MainLayout>
        <Loader message="Loading apparel article details & garment photos..." />
      </MainLayout>
    );
  }

  const baseStyleNo =
    product.baseStyleNumber ||
    (product.styleNumber ? product.styleNumber.split("-")[0] : product.sku);

  // Group all sibling variants by Color
  const colorGroups = {};
  allVariants.forEach((v) => {
    const colKey = (v.color || "Default").trim();
    if (!colorGroups[colKey]) {
      colorGroups[colKey] = {
        colorName: colKey,
        colorCode: v.colorCode || "",
        imageUrl: v.imageUrl || null,
        variants: [],
        totalStock: 0,
      };
    }
    colorGroups[colKey].variants.push(v);
    colorGroups[colKey].totalStock += Number(v.stockQuantity || 0);
    if (v.imageUrl && !colorGroups[colKey].imageUrl) {
      colorGroups[colKey].imageUrl = v.imageUrl;
    }
  });

  const availableColors = Object.keys(colorGroups);
  const activeColorKey = selectedColor && colorGroups[selectedColor] ? selectedColor : (availableColors[0] || "");
  const activeColorGroup = colorGroups[activeColorKey] || {
    colorName: product.color || "Default",
    colorCode: product.colorCode || "",
    imageUrl: product.imageUrl,
    variants: [product],
    totalStock: product.stockQuantity || 0,
  };

  // Find currently active variant for details
  const activeVariant =
    allVariants.find((v) => v.id === selectedVariantId) ||
    activeColorGroup.variants[0] ||
    product;

  const activeBarcode = activeVariant?.barcodes?.find((b) => b.isPrimary) || activeVariant?.barcodes?.[0];

  // Resolve current garment photo URL
  const displayedImageUrl = resolveProductImageUrl(
    activeVariant?.imageUrl || activeColorGroup?.imageUrl || product?.imageUrl,
    baseStyleNo,
    activeColorGroup?.colorName
  );

  const handleExportArticleExcel = async () => {
    try {
      setExportingExcel(true);
      toast.loading("Generating Excel sheet with embedded barcodes...", { id: "excel-toast" });

      await exportArticlesToExcelWithBarcodes({
        products: allVariants.length > 0 ? allVariants : [product],
        fileName: `Article_${baseStyleNo}_Report`,
        sheetName: `Article ${baseStyleNo}`,
      });

      toast.success(
        `Excel sheet for Article ${baseStyleNo} (${allVariants.length} variants) downloaded!`,
        { id: "excel-toast" }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel file", { id: "excel-toast" });
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* HEADER ACTIONS */}
        <PageHeader
          title={`Article - ${product.styleName || product.itemName || product.productName}`}
          description={`Style #${baseStyleNo} • ${availableColors.length} Color Option(s) • ${allVariants.length} Total Variant(s)`}
          action={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleExportArticleExcel}
                disabled={exportingExcel}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{exportingExcel ? "Exporting..." : "Excel (+ Barcodes)"}</span>
              </button>

              <button
                type="button"
                onClick={() => setPrintModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
              >
                <Printer className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Print Labels ({allVariants.length})</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/products/barcode/${activeVariant.id}`)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
              >
                <Tag className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Barcode Label</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/products/edit/${activeVariant.id}`)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition"
              >
                <Edit className="w-4 h-4 shrink-0" />
                <span>Edit Article</span>
              </button>
            </div>
          }
        />

        {/* 🌟 INTERACTIVE GARMENT SHOWCASE & COLOUR OPTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: GARMENT PHOTO PREVIEW */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <SurfaceCard className="p-4 sm:p-6 flex flex-col items-center justify-between min-h-[380px] bg-white border border-slate-200 shadow-sm">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <Package className="w-3.5 h-3.5 text-blue-600" />
                  Style #{baseStyleNo}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {activeColorGroup.colorName}
                </span>
              </div>

              {/* Main Garment Image Container */}
              <div className="w-full h-72 sm:h-80 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-center overflow-hidden relative group">
                <img
                  src={displayedImageUrl}
                  alt={`${product.productName} - ${activeColorGroup.colorName}`}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/uploads/placeholders/default-article.svg";
                  }}
                />

                {/* Color preview indicator tag */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 shadow-sm flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                    style={{ backgroundColor: getColorHex(activeColorGroup.colorName) }}
                  />
                  <span className="font-semibold">{activeColorGroup.colorName}</span>
                  {activeColorGroup.colorCode && (
                    <span className="text-[10px] text-slate-400 font-mono">({activeColorGroup.colorCode})</span>
                  )}
                </div>
              </div>

              {/* Garment Brand & Style Caption */}
              <div className="w-full pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 mt-3">
                <span className="font-medium text-slate-700">{product.brand || "Nordic Prowear"}</span>
                <span>{product.itemName || "Garment Article"}</span>
              </div>
            </SurfaceCard>
          </div>

          {/* RIGHT: COLOUR OPTIONS & SIZES INTERACTIVE SELECTOR */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 1. COLOUR OPTIONS SELECTOR */}
            <SurfaceCard className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Available Garment Colours
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click a colour option to view garment pictures and available size variants.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                  {availableColors.length} Colour{availableColors.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Color Option Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {availableColors.map((colorName) => {
                  const grp = colorGroups[colorName];
                  const isSelected = activeColorKey === colorName;
                  const hex = getColorHex(colorName);
                  const colorImg = resolveProductImageUrl(grp.imageUrl, baseStyleNo, colorName);

                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => {
                        setSelectedColor(colorName);
                        if (grp.variants.length > 0) {
                          setSelectedVariantId(grp.variants[0].id);
                        }
                      }}
                      className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/40 shadow-sm ring-2 ring-blue-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                      }`}
                    >
                      {/* Mini Thumbnail + Color Swatch */}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-sm shrink-0"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="font-bold text-slate-900 text-sm truncate">
                            {colorName}
                          </span>
                        </div>

                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {/* Small Pic thumbnail preview */}
                      <div className="w-full h-16 bg-slate-100/80 rounded-xl p-1.5 flex items-center justify-center overflow-hidden border border-slate-200/60">
                        <img
                          src={colorImg}
                          alt={colorName}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/uploads/placeholders/default-article.svg";
                          }}
                        />
                      </div>

                      {/* Stock & Count badge */}
                      <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2 font-medium">
                        <span>{grp.variants.length} Sizes</span>
                        <span className="font-semibold text-slate-700 font-mono">
                          {grp.totalStock} in stock
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SurfaceCard>

            {/* 2. AVAILABLE SIZES FOR SELECTED COLOUR */}
            <SurfaceCard className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Available Sizes in <span className="text-blue-600">{activeColorKey}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a size to view its exact SKU, Code128 Barcode, and stock level.
                  </p>
                </div>
              </div>

              {/* Sizes Pill Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {activeColorGroup.variants.map((v) => {
                  const isSelected = activeVariant?.id === v.id;
                  const isLowStock = (v.stockQuantity || 0) <= (v.minStockAlert || 5);

                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 text-slate-800"
                      }`}
                    >
                      <span className="text-sm font-bold">{v.size || "-"}</span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? "bg-blue-800 text-white"
                            : isLowStock
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {v.stockQuantity || 0} pcs
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Size Spec Spotlight */}
              {activeVariant && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-xs font-bold font-mono">
                        Size: {activeVariant.size}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        SKU: <strong className="text-slate-800">{activeVariant.sku}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-2">
                      <Barcode className="w-4 h-4 text-slate-400" />
                      Primary Barcode:{" "}
                      <strong className="font-mono text-slate-900">
                        {activeBarcode?.barcodeValue || "IMG-Pending"}
                      </strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => navigate(`/products/barcode/${activeVariant.id}`)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 shadow-sm transition w-full sm:w-auto"
                    >
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      <span>Print Single Sticker</span>
                    </button>
                  </div>
                </div>
              )}
            </SurfaceCard>
          </div>
        </div>

        {/* 🌟 VECTOR ISO 3758 NORWEGIAN TEXTILE CARE CARD */}
        <WashingCareCard
          styleNumber={baseStyleNo}
          fabric={activeVariant.fabric || product.fabric}
          customInstructions={activeVariant.washingInstructions || product.washingInstructions}
          brand={product.brand || "Nordic Prowear"}
        />

        {/* DETAILED SPECIFICATIONS & PRICE HISTORY */}
        <SurfaceCard className="p-5 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <InfoIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Full Article Specifications</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <Info label="Active Variant Style No" value={activeVariant.styleNumber || activeVariant.sku} />
            <Info label="Base Style No" value={activeVariant.baseStyleNumber || baseStyleNo} />
            <Info label="Style Name" value={activeVariant.styleName || product.styleName} />
            <Info label="Article / Item" value={activeVariant.itemName || product.itemName} />
            <Info label="Product Name" value={activeVariant.productName} />
            <Info label="SKU" value={activeVariant.sku} />
            <Info label="Primary Barcode" value={activeBarcode?.barcodeValue} />
            <Info label="Category" value={product.category?.name || "Apparel"} />
            <Info label="Brand" value={product.brand || "Nordic Prowear"} />
            <Info label="Color" value={activeVariant.color} />
            <Info label="Colour Code" value={activeVariant.colorCode || "-"} />
            <Info label="Size" value={activeVariant.size} />
            <Info label="Fabric" value={activeVariant.fabric || product.fabric || "-"} />
            <Info label="Fabric Composition" value={activeVariant.fabricComposition || product.fabricComposition || "-"} />
            <Info label="Fabric Weight" value={activeVariant.fabricWeight || product.fabricWeight || "-"} />
            <Info label="Purchase Price" value={activeVariant.purchasePrice ? `NOK ${activeVariant.purchasePrice}` : "NOK 0"} />
            <Info label="Sale Price" value={activeVariant.salePrice ? `NOK ${activeVariant.salePrice}` : "NOK 0"} />
            <Info label="Stock Quantity" value={`${activeVariant.stockQuantity || 0} units`} />
            <Info label="Min Stock Alert" value={`${activeVariant.minStockAlert || 5} units`} />
          </div>

          {/* Price History if available */}
          {priceHistory.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Price Revision History</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Old Price</th>
                      <th className="p-3">New Price</th>
                      <th className="p-3">Changed By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {priceHistory.map((h, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-mono">{new Date(h.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 font-mono">NOK {h.oldPrice}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">NOK {h.newPrice}</td>
                        <td className="p-3">{h.user?.name || "System Admin"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </SurfaceCard>
      </div>

      {/* 1-CLICK BARCODE PRINT MODAL */}
      <BarcodePrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        products={allVariants}
        title={`Print Barcodes - Style #${baseStyleNo} (${allVariants.length} Sizes/Colors)`}
      />
    </MainLayout>
  );
};

const Info = ({ label, value }) => {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-800 break-words">{value || "-"}</p>
    </div>
  );
};

export default ProductDetailsPage;
