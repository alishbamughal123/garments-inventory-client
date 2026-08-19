import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Printer,
  Download,
  Copy,
  Check,
  ArrowLeft,
  Tag,
  Layers,
  RefreshCw,
  FileSpreadsheet,
  Grid,
} from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import Loader from "../../components/ui/Loader";
import BarcodePrintModal from "../../components/products/BarcodePrintModal";
import { getProductById, getProducts } from "../../services/products.service";
import { exportArticlesToExcelWithBarcodes } from "../../utils/barcodeExport";
import { downloadCAD_DXF, downloadCAD_SVG } from "../../utils/cadExport";
import { FileCode } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes("railway")
    ? import.meta.env.VITE_API_URL
    : "https://garments-inventory-server.onrender.com/api/v1";

const BarcodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [allVariants, setAllVariants] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        const [productRes, allProductsRes] = await Promise.all([
          getProductById(id),
          getProducts().catch(() => ({ data: [] })),
        ]);

        const productData = productRes.data;
        if (!isMounted) return;

        setProduct(productData);

        const primaryBarcode =
          productData?.barcodes?.find((b) => b.isPrimary) || productData?.barcodes?.[0];

        setBarcode(primaryBarcode?.barcodeValue || productData?.sku || "");

        // Find all sibling variants of the same base style / style name
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

        setAllVariants(siblings.length > 0 ? siblings : [productData]);
      } catch (error) {
        console.error("Error loading product for barcode:", error);
        toast.error("Failed to load barcode details");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const barcodeImageUrl = barcode
    ? `${API_URL}/products/barcode/${encodeURIComponent(barcode)}`
    : "";

  const handleCopyBarcode = () => {
    if (!barcode) return;
    navigator.clipboard.writeText(barcode);
    setCopied(true);
    toast.success("Barcode number copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBarcode = async () => {
    if (!barcodeImageUrl) return;
    try {
      const response = await fetch(barcodeImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Barcode_${barcode || "article"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Barcode image downloaded!");
    } catch {
      toast.error("Could not download image");
    }
  };

  const handleExportArticleExcel = async () => {
    try {
      setExportingExcel(true);
      toast.loading("Generating Excel sheet with barcode images...", { id: "excel-toast" });

      const baseCode =
        product.baseStyleNumber ||
        (product.styleNumber ? product.styleNumber.split("-")[0] : product.sku);

      await exportArticlesToExcelWithBarcodes({
        products: allVariants.length > 0 ? allVariants : [product],
        fileName: `Article_${baseCode}_Barcodes`,
        sheetName: `Article ${baseCode}`,
      });

      toast.success(
        `Excel sheet for Article ${baseCode} (${allVariants.length} variants) downloaded!`,
        { id: "excel-toast" }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel file", { id: "excel-toast" });
    } finally {
      setExportingExcel(false);
    }
  };

  // Export CAD (.dxf) for ONLY this specific size/article
  const handleExportSingleCAD_DXF = () => {
    try {
      const code = product.sku || product.styleNumber || product.baseStyleNumber || "article";
      const sizeTag = product.size ? `_Size_${product.size}` : "";

      downloadCAD_DXF({
        products: [product],
        fileName: `Garment_CAD_${code}${sizeTag}`,
      });
      toast.success(`CAD (.dxf) for Size ${product.size || "OS"} downloaded!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate CAD DXF file");
    }
  };

  // Export Vector (.svg) for ONLY this specific size/article
  const handleExportSingleCAD_SVG = () => {
    try {
      const code = product.sku || product.styleNumber || product.baseStyleNumber || "article";
      const sizeTag = product.size ? `_Size_${product.size}` : "";

      downloadCAD_SVG({
        products: [product],
        fileName: `Garment_Vector_${code}${sizeTag}`,
      });
      toast.success(`Vector (.svg) for Size ${product.size || "OS"} downloaded!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate Vector CAD file");
    }
  };

  const handlePrintSingle = () => {
    window.print();
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader message="Generating article barcode label..." />
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-slate-500">Article not found.</p>
          <Button onClick={() => navigate("/products")} className="mt-4">
            Back to Articles
          </Button>
        </div>
      </MainLayout>
    );
  }

  const baseStyleNo =
    product.baseStyleNumber ||
    (product.styleNumber ? product.styleNumber.split("-")[0] : product.sku);

  return (
    <MainLayout>
      {/* PRINT-ONLY STYLES FOR SINGLE LABEL */}
      <style>{`
        @media print {
          @page {
            size: 100mm 50mm;
            margin: 2mm;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-barcode-label, #printable-barcode-label * {
            visibility: visible !important;
          }
          #printable-barcode-label {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
            box-shadow: none !important;
            border: 2px solid #0f172a !important;
            background: #fff !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title={`Article Barcode - ${product.productName}`}
          description={`Style #${baseStyleNo} • Size ${product.size || "OS"} (${product.color || "Standard"}) • High-resolution single & batch barcode sticker exports.`}
          action={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              {/* Single Size AutoCAD DXF Button */}
              <button
                type="button"
                onClick={handleExportSingleCAD_DXF}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100 hover:border-indigo-300"
                title={`Download AutoCAD DXF CAD file for Size ${product.size || "OS"}`}
              >
                <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>CAD (.dxf)</span>
              </button>

              {/* Single Size Vector SVG Button (Opens in Chrome/Edge) */}
              <button
                type="button"
                onClick={handleExportSingleCAD_SVG}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100 hover:border-violet-300"
                title={`Download Vector SVG file for Size ${product.size || "OS"} (Opens directly in Chrome/Edge)`}
              >
                <Layers className="w-4 h-4 text-violet-600 shrink-0" />
                <span>Vector (.svg)</span>
              </button>

              <button
                type="button"
                onClick={handleExportArticleExcel}
                disabled={exportingExcel}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{exportingExcel ? "Exporting..." : "Excel"}</span>
              </button>

              <button
                type="button"
                onClick={() => setPrintModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition"
              >
                <Printer className="w-4 h-4 text-white shrink-0" />
                <span>Print All Sizes ({allVariants.length})</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/products/${product.id}`)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>Back</span>
              </button>
            </div>
          }
        />

        {/* VARIANT SIZES QUICK PICKER BAR */}
        {allVariants.length > 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Grid className="w-4 h-4 text-indigo-600" />
                All Sizes for Article #{baseStyleNo} ({allVariants.length} Variants)
              </div>
              <span className="text-xs text-slate-400">Click any size to preview barcode</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {allVariants.map((v) => {
                const isCurrent = v.id === product.id;
                const vBarcode =
                  v.barcodes?.find((b) => b.isPrimary)?.barcodeValue ||
                  v.barcodes?.[0]?.barcodeValue ||
                  v.sku;

                return (
                  <button
                    key={v.id}
                    onClick={() => navigate(`/products/barcode/${v.id}`)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-2 ${
                      isCurrent
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
                        : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-bold uppercase">{v.size || "OS"}</span>
                    <span className="text-[10px] opacity-75 font-mono">({vBarcode})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* BARCODE LABEL CARD (LEFT) */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div
              id="printable-barcode-label"
              className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
            >
              {/* TOP HEADER / BRAND BADGE */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-200">
                    NP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {product.brand || "Nordic Prowear"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Garment Article Label</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  CODE128
                </span>
              </div>

              {/* ARTICLE NAME & DETAILS */}
              <div className="space-y-1 text-center mb-6">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                  {product.productName}
                </h3>
                <p className="text-xs font-semibold text-indigo-600">
                  Style #{product.styleNumber || product.sku}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium pt-1">
                  {product.color && <span>Color: {product.color}</span>}
                  {product.color && product.size && <span>•</span>}
                  {product.size && (
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      Size: {product.size}
                    </span>
                  )}
                </div>
              </div>

              {/* BARCODE IMAGE PREVIEW CONTAINER */}
              <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-6 flex flex-col items-center justify-center min-h-[140px] text-center relative group">
                {barcodeImageUrl ? (
                  <>
                    <img
                      src={barcodeImageUrl}
                      alt={`Barcode ${barcode}`}
                      onLoad={() => setImageLoaded(true)}
                      className={`max-w-full h-auto object-contain transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {!imageLoaded && (
                      <div className="flex items-center gap-2 text-slate-400 text-xs py-4">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating barcode...
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-400">No barcode available</p>
                )}
              </div>

              {/* BARCODE VALUE DIGITS */}
              <div className="mt-4 text-center">
                <p className="font-mono text-sm font-bold tracking-widest text-slate-800 bg-slate-100/70 py-1.5 px-4 rounded-xl inline-block border border-slate-200/50">
                  {barcode || "N/A"}
                </p>
              </div>

              {/* FOOTER INFO */}
              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>SKU: {product.sku}</span>
                <span>Stock: {product.stockQuantity} units</span>
              </div>
            </div>

            {/* ACTION BUTTONS BELOW LABEL */}
            <div className="w-full mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <Button
                onClick={handlePrintSingle}
                className="inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 py-2.5 rounded-xl font-semibold text-xs"
              >
                <Printer className="w-4 h-4" />
                Print Sticker
              </Button>

              <Button
                variant="outline"
                onClick={handleExportSingleCAD_DXF}
                className="inline-flex items-center justify-center gap-1.5 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-xl font-semibold text-xs"
                title="Download AutoCAD DXF CAD format for this size"
              >
                <FileCode className="w-4 h-4 text-indigo-600" />
                Save CAD (.dxf)
              </Button>

              <Button
                variant="outline"
                onClick={handleExportSingleCAD_SVG}
                className="inline-flex items-center justify-center gap-1.5 border-violet-200 bg-violet-50/50 hover:bg-violet-100 text-violet-700 py-2.5 rounded-xl font-semibold text-xs"
                title="Download Vector SVG format (Double-click opens directly in Chrome/Edge)"
              >
                <Layers className="w-4 h-4 text-violet-600" />
                Save Vector (.svg)
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadBarcode}
                className="inline-flex items-center justify-center gap-1.5 border-slate-200 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold text-xs"
              >
                <Download className="w-4 h-4" />
                Save PNG
              </Button>
            </div>
          </div>

          {/* ARTICLE METADATA & SIBLINGS LIST (RIGHT) */}
          <div className="md:col-span-6 space-y-6">
            <SurfaceCard className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Article Specifications</h4>
                    <p className="text-xs text-slate-500">Live barcode metadata & catalog specs</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportArticleExcel}
                  className="inline-flex items-center gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50 text-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Excel Export
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <SpecBox label="Base Style No" value={product.baseStyleNumber || baseStyleNo} />
                <SpecBox label="Style Name" value={product.styleName} />
                <SpecBox label="Category" value={product.category?.name} />
                <SpecBox label="Brand" value={product.brand || "Nordic Prowear"} />
                <SpecBox label="Color / Code" value={`${product.color} (${product.colorCode || "-"})`} />
                <SpecBox label="Current Size" value={product.size} highlight />
                <SpecBox label="Fabric" value={product.fabric} />
                <SpecBox label="Fabric Weight" value={product.fabricWeight} />
                <SpecBox
                  label="Sale Price"
                  value={product.salePrice ? `NOK ${product.salePrice}` : "-"}
                  highlight
                />
                <SpecBox label="Stock Quantity" value={`${product.stockQuantity} units`} />
              </div>

              <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed flex items-start gap-3">
                <Layers className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Export & Print Options:</span> Click{" "}
                  <strong>"Download Excel (+ Barcodes)"</strong> to get the Excel sheet with embedded barcode images for all sizes, or{" "}
                  <strong>"Print All Sizes"</strong> to generate standard A4/thermal sticker sheets ready to print.
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>

      {/* MULTI-VARIANT PRINT MODAL */}
      <BarcodePrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        products={allVariants}
        title={`Print Barcode Labels - Article #${baseStyleNo} (${allVariants.length} Sizes)`}
      />
    </MainLayout>
  );
};

const SpecBox = ({ label, value, highlight }) => (
  <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-3.5 transition-all duration-200 hover:bg-slate-50 hover:border-slate-200">
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p
      className={`mt-1 text-xs sm:text-sm font-semibold truncate ${
        highlight ? "text-indigo-600 font-extrabold" : "text-slate-800"
      }`}
    >
      {value || "-"}
    </p>
  </div>
);

export default BarcodePage;
