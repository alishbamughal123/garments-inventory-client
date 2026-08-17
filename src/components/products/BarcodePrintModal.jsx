import { useState, useEffect } from "react";
import { Printer, Download, X, Settings2, FileSpreadsheet, Check } from "lucide-react";
import Button from "../ui/Button";
import { generateBarcodeImageBase64, exportArticlesToExcelWithBarcodes } from "../../utils/barcodeExport";
import toast from "react-hot-toast";

const BarcodePrintModal = ({
  isOpen,
  onClose,
  products = [],
  title = "Print Barcode Labels",
}) => {
  const [template, setTemplate] = useState("A4-24"); // A4-24, A4-14, Thermal, Hangtag
  const [copiesMode, setCopiesMode] = useState("single"); // 'single' (1 per item) or 'stock' (by stock qty)
  const [includePrice, setIncludePrice] = useState(true);
  const [includeBrand, setIncludeBrand] = useState(true);
  const [includeSpecs, setIncludeSpecs] = useState(true);
  const [barcodeImages, setBarcodeImages] = useState({});
  const [generatingImages, setGeneratingImages] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  useEffect(() => {
    if (!isOpen || products.length === 0) return;

    let isMounted = true;
    (async () => {
      setGeneratingImages(true);
      const imagesMap = {};

      for (const p of products) {
        const barcodeVal =
          p.barcodes?.find((b) => b.isPrimary)?.barcodeValue ||
          p.barcodes?.[0]?.barcodeValue ||
          p.sku;

        if (barcodeVal && !imagesMap[barcodeVal]) {
          const res = await generateBarcodeImageBase64(barcodeVal);
          if (res?.dataUrl) {
            imagesMap[barcodeVal] = res.dataUrl;
          }
        }
      }

      if (isMounted) {
        setBarcodeImages(imagesMap);
        setGeneratingImages(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isOpen, products]);

  if (!isOpen) return null;

  // Flatten labels based on copies mode
  const labelItems = [];
  products.forEach((p) => {
    const qty = copiesMode === "stock" ? Math.max(1, p.stockQuantity || 1) : 1;
    const barcodeVal =
      p.barcodes?.find((b) => b.isPrimary)?.barcodeValue ||
      p.barcodes?.[0]?.barcodeValue ||
      p.sku;

    for (let i = 0; i < qty; i++) {
      labelItems.push({
        ...p,
        resolvedBarcode: barcodeVal,
        labelIndex: `${p.id}-${i}`,
      });
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      toast.loading("Generating Excel sheet with embedded barcodes...", { id: "excel-toast" });
      await exportArticlesToExcelWithBarcodes({
        products,
        fileName: products.length === 1 ? `Barcode_${products[0].sku || products[0].styleNumber}` : "Articles_Barcodes_Sheet",
      });
      toast.success("Excel file downloaded successfully!", { id: "excel-toast" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel file", { id: "excel-toast" });
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      {/* PRINT-ONLY CSS RULES */}
      <style>{`
        @media print {
          @page {
            size: ${template === "Thermal" ? "100mm 50mm" : "A4 portrait"};
            margin: ${template === "Thermal" ? "2mm" : "8mm"};
          }
          body * {
            visibility: hidden !important;
          }
          #barcode-print-sheet, #barcode-print-sheet * {
            visibility: visible !important;
          }
          #barcode-print-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* HEADER CONTROLS (NO-PRINT) */}
        <div className="no-print p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-600" />
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {products.length} article variant(s) • Total {labelItems.length} label(s) to print
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={exportingExcel}
              className="hidden sm:inline-flex items-center gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              {exportingExcel ? "Exporting..." : "Excel (.xlsx) with Barcodes"}
            </Button>

            <Button
              onClick={handlePrint}
              size="sm"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
            >
              <Printer className="w-4 h-4" />
              Print Labels
            </Button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SETTINGS TOOLBAR (NO-PRINT) */}
        <div className="no-print bg-slate-100/70 p-3 sm:p-4 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Template Selector */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 flex items-center gap-1">
                <Settings2 className="w-3.5 h-3.5" /> Paper:
              </span>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
              >
                <option value="A4-24">A4 Sheet (3×8 = 24 Labels/Page)</option>
                <option value="A4-14">A4 Sheet (2×7 = 14 Labels/Page)</option>
                <option value="Thermal">Thermal Roll (4" × 2" / 100×50mm)</option>
                <option value="Hangtag">Garment Hangtag Card</option>
              </select>
            </div>

            {/* Copies Mode */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Quantity:</span>
              <select
                value={copiesMode}
                onChange={(e) => setCopiesMode(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
              >
                <option value="single">1 Label per Variant ({products.length} labels)</option>
                <option value="stock">1 Label per Stock Unit ({labelItems.length} labels)</option>
              </select>
            </div>
          </div>

          {/* Display Checkboxes */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includePrice}
                onChange={(e) => setIncludePrice(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Show Price (NOK)
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeBrand}
                onChange={(e) => setIncludeBrand(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Brand Badge
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeSpecs}
                onChange={(e) => setIncludeSpecs(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Size / Color
            </label>
          </div>
        </div>

        {/* PRINTABLE BARCODE SHEET PREVIEW */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/50 flex justify-center">
          {generatingImages ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium">Generating barcode graphics...</p>
            </div>
          ) : (
            <div
              id="barcode-print-sheet"
              className={`bg-white shadow-xl rounded-2xl p-4 sm:p-6 transition-all ${
                template === "Thermal"
                  ? "w-[380px] max-w-full"
                  : template === "A4-14"
                  ? "w-full max-w-3xl"
                  : "w-full max-w-4xl"
              }`}
            >
              <div
                className={`grid gap-3 ${
                  template === "A4-24"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                    : template === "A4-14"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : template === "Thermal"
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                }`}
              >
                {labelItems.map((item, idx) => {
                  const imgUrl = barcodeImages[item.resolvedBarcode];
                  return (
                    <div
                      key={item.labelIndex || idx}
                      className="border-2 border-slate-900 rounded-xl p-3 bg-white flex flex-col justify-between text-slate-900 break-inside-avoid relative overflow-hidden"
                      style={{ minHeight: template === "Hangtag" ? "180px" : "130px" }}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-1.5">
                        <div className="min-w-0">
                          {includeBrand && (
                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                              {item.brand || "Nordic Prowear"}
                            </p>
                          )}
                          <p className="text-xs font-bold truncate leading-tight">
                            {item.productName || item.styleName || "Article"}
                          </p>
                        </div>
                        {includePrice && item.salePrice && (
                          <div className="text-right shrink-0 pl-2">
                            <span className="text-xs font-black text-slate-900 font-mono">
                              NOK {item.salePrice}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Specs: Size / Color / Style */}
                      <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold mb-1">
                        <span className="font-mono">#{item.styleNumber || item.sku}</span>
                        {includeSpecs && (
                          <div className="flex items-center gap-1.5">
                            {item.color && <span>{item.color}</span>}
                            {item.size && (
                              <span className="bg-slate-900 text-white px-1.5 py-0.2 rounded text-[9px] font-bold">
                                {item.size}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Barcode Graphic */}
                      <div className="flex flex-col items-center justify-center my-1">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={item.resolvedBarcode}
                            className="max-h-12 w-auto object-contain"
                          />
                        ) : (
                          <div className="h-10 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                            {item.resolvedBarcode}
                          </div>
                        )}
                      </div>

                      {/* Bottom Digits & SKU */}
                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono pt-1 border-t border-slate-100">
                        <span>SKU: {item.sku}</span>
                        <span className="font-bold text-slate-800">{item.resolvedBarcode}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER (NO-PRINT) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200/60 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={exportingExcel}
            className="inline-flex items-center gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Download Excel Sheet
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={handlePrint}
              size="sm"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
            >
              <Printer className="w-4 h-4" />
              Print Labels Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodePrintModal;
