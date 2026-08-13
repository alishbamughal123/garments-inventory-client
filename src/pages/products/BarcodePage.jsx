import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Printer, Download, Copy, Check, ArrowLeft, Tag, Layers, RefreshCw } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import Loader from "../../components/ui/Loader";
import { getProductById } from "../../services/products.service";

const API_URL =
  import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes("railway")
    ? import.meta.env.VITE_API_URL
    : "https://garments-inventory-server.onrender.com/api/v1";

const BarcodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await getProductById(id);
        const productData = response.data;

        if (!isMounted) return;

        setProduct(productData);

        const primaryBarcode =
          productData?.barcodes?.find((b) => b.isPrimary) || productData?.barcodes?.[0];

        setBarcode(primaryBarcode?.barcodeValue || productData?.sku || "");
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

  const handlePrint = () => {
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

  return (
    <MainLayout>
      {/* PRINT-ONLY STYLES */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-barcode-label, #printable-barcode-label * {
            visibility: visible;
          }
          #printable-barcode-label {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            max-width: 400px;
            box-shadow: none !important;
            border: 2px solid #000 !important;
            background: #fff !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title="Article Barcode Label"
          description="High-resolution barcode preview, printable hangtag sticker, and article specification details."
          action={
            <Button
              variant="outline"
              onClick={() => navigate(`/products/${product.id}`)}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Details
            </Button>
          }
        />

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
                  {product.size && <span className="font-bold text-slate-700">Size: {product.size}</span>}
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
                <span>Category: {product.category?.name || "General"}</span>
              </div>
            </div>

            {/* ACTION BUTTONS BELOW LABEL */}
            <div className="w-full mt-6 grid grid-cols-3 gap-3">
              <Button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 py-3 rounded-2xl font-semibold text-xs sm:text-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadBarcode}
                className="inline-flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-100 text-slate-700 py-3 rounded-2xl font-semibold text-xs sm:text-sm"
              >
                <Download className="w-4 h-4" />
                Save PNG
              </Button>

              <Button
                variant="outline"
                onClick={handleCopyBarcode}
                className="inline-flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-100 text-slate-700 py-3 rounded-2xl font-semibold text-xs sm:text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy No"}
              </Button>
            </div>
          </div>

          {/* ARTICLE METADATA & SPECS (RIGHT) */}
          <div className="md:col-span-6 space-y-6">
            <SurfaceCard className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Article Specifications</h4>
                  <p className="text-xs text-slate-500">Live barcode metadata & catalog specs</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SpecBox label="Base Style No" value={product.baseStyleNumber} />
                <SpecBox label="Style Name" value={product.styleName} />
                <SpecBox label="Category" value={product.category?.name} />
                <SpecBox label="Brand" value={product.brand} />
                <SpecBox label="Color / Code" value={`${product.color} (${product.colorCode || "-"})`} />
                <SpecBox label="Size" value={product.size} />
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
                  <span className="font-bold">Printing Tip:</span> For optimal barcode scan rate on thermal label printers, use standard 4x2 inch label paper. Clicking "Print" will cleanly format only the label sticker.
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
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
