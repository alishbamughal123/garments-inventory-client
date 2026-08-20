import { useState, useEffect, useMemo } from "react";
import {
  Printer,
  Download,
  X,
  Settings2,
  FileSpreadsheet,
  Check,
  Package,
  Layers,
  Tag,
  Boxes,
  Plus,
  Minus,
  RotateCcw,
  QrCode,
  CheckCircle2,
  FileCode,
  Palette,
} from "lucide-react";
import Button from "../ui/Button";
import {
  generateBarcodeImageBase64,
  generateQRCodeImageBase64,
  exportArticlesToExcelWithBarcodes,
  exportMixedCartonToExcel,
} from "../../utils/barcodeExport";
import {
  downloadCAD_DXF,
  downloadCAD_SVG,
  downloadMixedCartonCAD_DXF,
} from "../../utils/cadExport";
import { getColorHex } from "../../utils/imageHelper";
import toast from "react-hot-toast";

const BarcodePrintModal = ({
  isOpen,
  onClose,
  products = [],
  title = "Print Barcode Labels",
  initialMode = "individual", // 'individual' | 'mixed_carton'
}) => {
  // Modal Mode: 'individual' (garment hangtags/stickers) vs 'mixed_carton' (solid color / mixed sizes carton)
  const [activeTab, setActiveTab] = useState(initialMode || "individual");

  // Synchronize active tab whenever modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode || "individual");
    }
  }, [isOpen, initialMode]);

  // Individual Mode State
  const [template, setTemplate] = useState("A4-24"); // A4-24, A4-14, Thermal, Hangtag
  const [copiesMode, setCopiesMode] = useState("single"); // 'single' | 'stock'
  const [includePrice, setIncludePrice] = useState(true);
  const [includeBrand, setIncludeBrand] = useState(true);
  const [includeSpecs, setIncludeSpecs] = useState(true);

  // 1. Group products by Style Number (Clean multi-style support)
  const stylesMap = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const sNo = String(
        p.baseStyleNumber ||
        (p.styleNumber ? p.styleNumber.split("-")[0] : p.sku) ||
        "STYLE"
      ).trim();
      if (!map[sNo]) {
        map[sNo] = {
          styleNo: sNo,
          styleName: p.styleName || p.itemName || p.productName || "Apparel",
          products: [],
        };
      }
      map[sNo].products.push(p);
    });
    return map;
  }, [products]);

  const availableStyleNumbers = useMemo(() => Object.keys(stylesMap), [stylesMap]);
  const [selectedStyleNo, setSelectedStyleNo] = useState("");

  // Default to first style
  useEffect(() => {
    if (availableStyleNumbers.length > 0) {
      if (!selectedStyleNo || !stylesMap[selectedStyleNo]) {
        setSelectedStyleNo(availableStyleNumbers[0]);
      }
    }
  }, [availableStyleNumbers, selectedStyleNo, stylesMap]);

  const activeStyleNo = selectedStyleNo && stylesMap[selectedStyleNo] ? selectedStyleNo : (availableStyleNumbers[0] || "STYLE");
  const activeStyleData = stylesMap[activeStyleNo] || { styleNo: activeStyleNo, styleName: "Apparel", products: [] };
  const currentStyleProducts = activeStyleData.products;

  // 2. Group ONLY the active style's products by Color
  const colorGroups = useMemo(() => {
    const map = {};
    currentStyleProducts.forEach((p) => {
      const col = (p.color || "Standard").trim();
      if (!map[col]) {
        map[col] = {
          colorName: col,
          colorCode: p.colorCode || "",
          products: [],
        };
      }
      map[col].products.push(p);
    });
    return map;
  }, [currentStyleProducts]);

  const availableColors = useMemo(() => Object.keys(colorGroups), [colorGroups]);
  const [selectedColor, setSelectedColor] = useState("");

  // Default to first color of current style
  useEffect(() => {
    if (availableColors.length > 0) {
      if (!selectedColor || !colorGroups[selectedColor]) {
        setSelectedColor(availableColors[0]);
      }
    }
  }, [availableColors, selectedColor, colorGroups]);

  const activeColor = selectedColor && colorGroups[selectedColor] ? selectedColor : (availableColors[0] || "Standard");
  const activeColorData = colorGroups[activeColor] || { colorName: activeColor, colorCode: "", products: [] };
  const activeColorProducts = activeColorData.products || [];

  // Mixed Carton Mode State
  const [orderNo, setOrderNo] = useState("NP10002");
  const [cartonNo, setCartonNo] = useState("Z15 (Last Box)");
  const [cartonQuantities, setCartonQuantities] = useState({}); // { [sku]: qty }

  // Master Barcode & QR Code states for active color
  const [masterBarcodeImg, setMasterBarcodeImg] = useState("");
  const [qrCodeImg, setQrCodeImg] = useState("");

  const [barcodeImages, setBarcodeImages] = useState({});
  const [generatingImages, setGeneratingImages] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  // Initialize mixed carton quantities with default 1 or stock leftovers
  useEffect(() => {
    if (products.length > 0) {
      const initialQtys = {};
      products.forEach((p, idx) => {
        initialQtys[p.sku] = idx < 6 ? Math.min(12, Math.max(2, p.stockQuantity || 5)) : 0;
      });
      setCartonQuantities((prev) => ({ ...initialQtys, ...prev }));
    }
  }, [products]);

  // Generate barcodes for all variants
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
        setBarcodeImages((prev) => ({ ...prev, ...imagesMap }));
        setGeneratingImages(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isOpen, products]);

  const baseStyleNo = activeStyleNo;
  const styleName = activeStyleData.styleName;

  // Master barcode for the selected color carton (Compact & 100% scannable)
  const masterBarcodeVal = useMemo(() => {
    const cleanCarton = cartonNo.split(/[\(\s]/)[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 5) || "Z15";
    const cleanOrder = orderNo.replace(/[^a-zA-Z0-9]/g, "").slice(0, 7) || "ORD";
    const cleanColor = (activeColor.length <= 4 ? activeColor : activeColor.slice(0, 4)).toUpperCase().replace(/[^a-zA-Z0-9]/g, "") || "CLR";
    const cleanStyle = String(baseStyleNo).replace(/[^a-zA-Z0-9]/g, "").slice(0, 6) || "STY";
    return `CTN-${cleanOrder}-${cleanCarton}-${cleanStyle}-${cleanColor}`;
  }, [orderNo, cartonNo, baseStyleNo, activeColor]);

  // Filter active color items with quantity > 0
  const activeColorSelectedItems = useMemo(() => {
    return activeColorProducts
      .filter((p) => Number(cartonQuantities[p.sku] || 0) > 0)
      .map((p) => {
        const barcodeVal =
          p.barcodes?.find((b) => b.isPrimary)?.barcodeValue ||
          p.barcodes?.[0]?.barcodeValue ||
          p.sku;
        return {
          ...p,
          cartonQty: Number(cartonQuantities[p.sku] || 0),
          resolvedBarcode: barcodeVal,
        };
      });
  }, [activeColorProducts, cartonQuantities]);

  const totalActiveColorPcs = useMemo(() => {
    return activeColorSelectedItems.reduce((sum, item) => sum + item.cartonQty, 0);
  }, [activeColorSelectedItems]);

  // Generate Master Barcode & QR Code for the Active Color Carton
  useEffect(() => {
    if (activeTab !== "mixed_carton") return;

    let isMounted = true;
    (async () => {
      try {
        const masterRes = await generateBarcodeImageBase64(masterBarcodeVal);
        if (isMounted && masterRes?.dataUrl) {
          setMasterBarcodeImg(masterRes.dataUrl);
        }

        const qrPayload = JSON.stringify({
          carton: masterBarcodeVal,
          orderNo: orderNo,
          style: baseStyleNo,
          color: activeColor,
          totalQty: totalActiveColorPcs,
          items: activeColorSelectedItems.map((i) => ({
            size: i.size,
            sku: i.sku,
            barcode: i.resolvedBarcode,
            qty: i.cartonQty,
          })),
        });

        const qrRes = await generateQRCodeImageBase64(qrPayload);
        if (isMounted && qrRes) {
          setQrCodeImg(qrRes);
        }
      } catch (err) {
        console.error("Error generating master carton codes:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [activeTab, masterBarcodeVal, activeColor, activeColorSelectedItems, totalActiveColorPcs, orderNo, baseStyleNo]);

  if (!isOpen) return null;

  // Flatten individual labels
  const individualLabelItems = [];
  products.forEach((p) => {
    const qty = copiesMode === "stock" ? Math.max(1, p.stockQuantity || 1) : 1;
    const barcodeVal =
      p.barcodes?.find((b) => b.isPrimary)?.barcodeValue ||
      p.barcodes?.[0]?.barcodeValue ||
      p.sku;

    for (let i = 0; i < qty; i++) {
      individualLabelItems.push({
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
      if (activeTab === "mixed_carton") {
        toast.loading(`Generating Excel manifest for ${activeColor} Carton...`, { id: "excel-toast" });
        await exportMixedCartonToExcel({
          orderNo,
          cartonNo,
          styleNo: baseStyleNo,
          styleName,
          color: activeColor,
          totalQty: totalActiveColorPcs,
          items: activeColorSelectedItems,
          masterBarcodeVal,
          fileName: `Mixed_Carton_Manifest_${baseStyleNo}_${activeColor}`,
        });
        toast.success(`Carton manifest for ${activeColor} downloaded!`, { id: "excel-toast" });
      } else {
        toast.loading("Generating Excel sheet with embedded barcodes...", { id: "excel-toast" });
        await exportArticlesToExcelWithBarcodes({
          products,
          fileName: products.length === 1 ? `Barcode_${products[0].sku || products[0].styleNumber}` : "Articles_Barcodes_Sheet",
        });
        toast.success("Excel file downloaded successfully!", { id: "excel-toast" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel file", { id: "excel-toast" });
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportCAD = () => {
    try {
      if (activeTab === "mixed_carton") {
        downloadMixedCartonCAD_DXF({
          orderNo,
          cartonNo,
          styleNo: baseStyleNo,
          styleName,
          color: activeColor,
          totalQty: totalActiveColorPcs,
          items: activeColorSelectedItems,
          masterBarcodeVal,
          fileName: `Mixed_Carton_Sticker_${baseStyleNo}_${activeColor}`,
        });
        toast.success(`AutoCAD DXF for ${activeColor} Mixed Carton Sticker downloaded!`);
      } else {
        downloadCAD_DXF({
          products: products,
          fileName: `Garment_CAD_Labels_${baseStyleNo}`,
        });
        toast.success(`AutoCAD DXF file for Style #${baseStyleNo} downloaded!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate CAD DXF file");
    }
  };

  // Mixed carton qty helpers (applied to active color)
  const handleQtyChange = (sku, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setCartonQuantities((prev) => ({ ...prev, [sku]: num }));
  };

  const handleIncrement = (sku) => {
    setCartonQuantities((prev) => ({ ...prev, [sku]: (Number(prev[sku]) || 0) + 1 }));
  };

  const handleDecrement = (sku) => {
    setCartonQuantities((prev) => ({ ...prev, [sku]: Math.max(0, (Number(prev[sku]) || 0) - 1) }));
  };

  const handleResetActiveColor = () => {
    const update = {};
    activeColorProducts.forEach((p) => {
      update[p.sku] = 0;
    });
    setCartonQuantities((prev) => ({ ...prev, ...update }));
  };

  const handleFillActiveColor = () => {
    const update = {};
    activeColorProducts.forEach((p) => {
      update[p.sku] = Math.max(1, p.stockQuantity || 5);
    });
    setCartonQuantities((prev) => ({ ...prev, ...update }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      {/* PRINT-ONLY CSS RULES */}
      <style>{`
        @media print {
          @page {
            size: ${
              activeTab === "mixed_carton"
                ? "100mm 150mm"
                : template === "Thermal"
                ? "100mm 50mm"
                : "A4 portrait"
            };
            margin: ${activeTab === "mixed_carton" || template === "Thermal" ? "2mm" : "6mm"};
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
          #barcode-print-sheet .overflow-y-auto {
            max-height: none !important;
            overflow: visible !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* HEADER CONTROLS (NO-PRINT) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-600" />
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Style #{baseStyleNo} • {availableColors.length} Color(s) • {products.length} Total Sizes/Variants
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCAD}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 text-xs font-semibold shadow-sm transition"
              title="Download AutoCAD DXF CAD format"
            >
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span>CAD (.dxf)</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={exportingExcel}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{exportingExcel ? "Exporting..." : "Excel (.xlsx)"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>{activeTab === "mixed_carton" ? `Print ${activeColor} Carton Sticker` : "Print Labels"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 🌟 TOP TAB SWITCHER: INDIVIDUAL vs MIXED CARTON (NO-PRINT) */}
        <div className="no-print bg-slate-100/90 px-4 pt-3 border-b border-slate-200 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("individual")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
              activeTab === "individual"
                ? "bg-white text-blue-600 border-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900 border-transparent"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>🏷️ Individual Garment Labels ({individualLabelItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mixed_carton")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
              activeTab === "mixed_carton"
                ? "bg-white text-indigo-700 border-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900 border-transparent"
            }`}
          >
            <Boxes className="w-4 h-4 text-indigo-600" />
            <span>📦 Mixed Sizes Carton (Solid Color / Assorted Sizes)</span>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
              {activeColor}: {totalActiveColorPcs} pcs
            </span>
          </button>
        </div>

        {/* ⚙️ CONTROLS TOOLBAR PER TAB (NO-PRINT) */}
        {activeTab === "individual" ? (
          <div className="no-print bg-slate-50 p-3 sm:p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
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
                  <option value="stock">1 Label per Stock Unit ({individualLabelItems.length} labels)</option>
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
        ) : (
          /* 📦 SOLID COLOR - MIXED SIZES CONFIGURATION PANEL */
          <div className="no-print bg-slate-50 p-3 sm:p-4 border-b border-slate-200 text-xs space-y-2.5">
            {/* 1. COMPACT 4-FIELD CONFIGURATION GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Style Selection (if multiple styles in products) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Style Article:
                </label>
                {availableStyleNumbers.length > 1 ? (
                  <select
                    value={activeStyleNo}
                    onChange={(e) => {
                      setSelectedStyleNo(e.target.value);
                      setSelectedColor("");
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                  >
                    {availableStyleNumbers.map((sNo) => (
                      <option key={sNo} value={sNo}>
                        #{sNo} - {stylesMap[sNo].styleName} ({stylesMap[sNo].products.length} vars)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-slate-100/90 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 truncate">
                    #{activeStyleNo} ({activeStyleData.styleName})
                  </div>
                )}
              </div>

              {/* Garment Color Selection for this Carton */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Carton Garment Color:</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">{availableColors.length} color(s)</span>
                </label>
                <select
                  value={activeColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-900 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                >
                  {availableColors.map((col) => {
                    const grp = colorGroups[col];
                    const count = (grp?.products || []).reduce(
                      (acc, p) => acc + (Number(cartonQuantities[p.sku]) || 0),
                      0
                    );
                    return (
                      <option key={col} value={col}>
                        {col} ({count} pcs / {(grp?.products || []).length} sizes)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Order Reference */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Order No / Ref:
                </label>
                <input
                  type="text"
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  placeholder="e.g. NP10002"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                />
              </div>

              {/* Carton Number / Label */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Carton Description:
                </label>
                <input
                  type="text"
                  value={cartonNo}
                  onChange={(e) => setCartonNo(e.target.value)}
                  placeholder="e.g. Z15 (Assorted Sizes)"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                />
              </div>
            </div>

            {/* 2. MASTER BARCODE PREVIEW STRIP & QUICK ACTIONS */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600">Master Barcode:</span>
                <code className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold">
                  {masterBarcodeVal}
                </code>
                <span className="text-[10px] text-slate-500">
                  (Solid {activeColor} • Mixed sizes)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleFillActiveColor}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-[11px] transition shadow-2xs"
                >
                  Fill Stock ({activeColor})
                </button>
                <button
                  type="button"
                  onClick={handleResetActiveColor}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-[11px] transition shadow-2xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 📄 MAIN CONTENT AREA (SPLIT OR FULL) */}
        <div className="flex-1 overflow-y-auto bg-slate-200/50 flex flex-col md:flex-row">
          {/* If Mixed Carton Tab, show item quantity editor on Left side (ONLY FOR ACTIVE COLOR) */}
          {activeTab === "mixed_carton" && (
            <div className="no-print w-full md:w-72 bg-white border-r border-slate-200 p-3.5 overflow-y-auto max-h-[60vh] md:max-h-full">
              <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: getColorHex(activeColor) }}
                    />
                    {activeColor} ({activeColorProducts.length} Sizes)
                  </h4>
                  <p className="text-[10px] text-slate-400">Solid Color Carton</p>
                </div>
                <span className="font-black text-indigo-700 text-xs bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  {totalActiveColorPcs} pcs
                </span>
              </div>

              <div className="space-y-1.5">
                {activeColorProducts.map((p) => {
                  const qty = Number(cartonQuantities[p.sku] || 0);
                  const isSelected = qty > 0;
                  return (
                    <div
                      key={p.sku}
                      className={`p-2 rounded-xl border transition flex items-center justify-between ${
                        isSelected
                          ? "bg-indigo-50/70 border-indigo-300"
                          : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                            Size {p.size || "OS"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono truncate">{p.sku}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Stock: {p.stockQuantity || 0}</div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDecrement(p.sku)}
                          className="w-5 h-5 rounded bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-xs"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => handleQtyChange(p.sku, e.target.value)}
                          className="w-10 text-center text-xs font-bold bg-white border border-slate-300 rounded py-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => handleIncrement(p.sku)}
                          className="w-5 h-5 rounded bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-xs"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RIGHT SIDE: PRINTABLE SHEET PREVIEW */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
            {generatingImages ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm font-medium">Generating barcode graphics...</p>
              </div>
            ) : activeTab === "mixed_carton" ? (
              /* 🌟 SOLID COLOR - MIXED SIZES CARTON STICKER (Printable Container) */
              <div
                id="barcode-print-sheet"
                className="w-[440px] max-w-full bg-white shadow-2xl rounded-2xl border-2 border-slate-900 p-4 sm:p-5 text-slate-900"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2.5 mb-3">
                  <div>
                    <div className="text-base font-black tracking-wider uppercase text-slate-900">
                      NORDIC PROWEAR
                    </div>
                    <div className="text-[10px] font-semibold text-slate-600">
                      Garment Logistics & Warehousing
                    </div>
                  </div>
                  <div className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider shadow-sm">
                    ⚠️ LAST BOX (MIXED SIZES)
                  </div>
                </div>

                {/* Carton Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-100 p-2.5 rounded-lg border border-slate-300 mb-3">
                  <div>
                    <span className="text-slate-500 font-bold">Order No: </span>
                    <strong className="text-slate-900">{orderNo || "NP10002"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">Carton: </span>
                    <strong className="text-slate-900">{cartonNo || "Z15 (Assorted Sizes)"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">Style: </span>
                    <strong className="text-slate-900">
                      #{baseStyleNo} ({styleName})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">Garment Color: </span>
                    <strong className="text-indigo-900 uppercase font-black">{activeColor} (Solid Color)</strong>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-bold">Total Items in Box: </span>
                    <strong className="text-red-600 font-black text-sm">{totalActiveColorPcs} PCS</strong>
                  </div>
                </div>

                {/* Master Carton Barcode for this Specific Color */}
                <div className="bg-blue-50/80 border-2 border-dashed border-blue-400 rounded-xl p-3 text-center mb-3">
                  <div className="text-[10px] font-black text-blue-800 uppercase tracking-wider mb-1">
                    📦 MASTER CARTON BARCODE - {activeColor.toUpperCase()} ASSORTED SIZES
                  </div>
                  {masterBarcodeImg ? (
                    <img
                      src={masterBarcodeImg}
                      alt={masterBarcodeVal}
                      className="max-h-12 w-auto mx-auto object-contain"
                    />
                  ) : (
                    <div className="font-mono text-xs font-bold text-slate-700 py-2">
                      {masterBarcodeVal}
                    </div>
                  )}
                  <div className="font-mono text-[9px] font-bold text-slate-600 mt-1">
                    {masterBarcodeVal}
                  </div>
                </div>

                {/* Itemized Size Breakdown Table for this Specific Color */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] font-black text-slate-900 border-b border-slate-300 pb-1 mb-1.5 uppercase">
                    <span>Size Breakdown ({activeColor})</span>
                    <span>Unit Barcode</span>
                  </div>

                  {activeColorSelectedItems.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs italic">
                      No sizes selected for {activeColor}. Adjust quantities on the left.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                      {activeColorSelectedItems.map((item) => {
                        const imgUrl = barcodeImages[item.resolvedBarcode];
                        return (
                          <div
                            key={item.sku}
                            className="flex items-center justify-between py-1 border-b border-slate-100 text-[11px]"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-bold text-slate-900 truncate">
                                Size {item.size || "OS"} • <span className="text-slate-500 font-normal">{item.color}</span>
                              </div>
                              <div className="text-[9px] text-slate-500 font-mono">{item.sku}</div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="bg-slate-900 text-white font-black text-[10px] px-2 py-0.5 rounded">
                                {item.cartonQty} pcs
                              </span>
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={item.resolvedBarcode}
                                  className="h-7 w-24 object-contain"
                                />
                              ) : (
                                <span className="font-mono text-[9px] text-slate-600">
                                  {item.resolvedBarcode}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer with QR */}
                <div className="border-t-2 border-slate-900 pt-2 flex items-center justify-between">
                  <div className="text-[9px] text-slate-600 leading-tight pr-2">
                    <strong>Official Nordic Prowear ERP Packing Label</strong>
                    <br />
                    Solid Color Assorted Sizes Carton • {activeColor}
                  </div>
                  {qrCodeImg && (
                    <img src={qrCodeImg} alt="QR Manifest" className="w-11 h-11 shrink-0" />
                  )}
                </div>
              </div>
            ) : (
              /* 🏷️ INDIVIDUAL LABELS PREVIEW */
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
                  {individualLabelItems.map((item, idx) => {
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
        </div>

        {/* FOOTER (NO-PRINT) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCAD}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 px-4 py-2 text-xs font-semibold shadow-sm transition"
              title="Download AutoCAD DXF CAD format"
            >
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span>Export CAD (.dxf)</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={exportingExcel}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Download Excel Sheet</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-semibold shadow-sm transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>{activeTab === "mixed_carton" ? `Print ${activeColor} Carton Sticker` : "Print Labels Now"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodePrintModal;
