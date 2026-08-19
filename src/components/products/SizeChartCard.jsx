import { useState, useEffect } from "react";
import {
  Ruler,
  Table,
  Layers,
  HelpCircle,
  Printer,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Info,
  Sparkles
} from "lucide-react";
import SurfaceCard from "../ui/SurfaceCard";
import { getSizeChartByStyle, DEFAULT_SIZE_CHART_10105_10106_10116 } from "../../services/sizechart.service";
import { useLanguage } from "../../context/LanguageContext";

const normalizeSizeKey = (s) => {
  if (!s) return "";
  const str = String(s).trim().toUpperCase();
  if (str === "XS" || str === "X-SMALL" || str === "EXTRA SMALL") return "XS";
  if (str === "S" || str === "SMALL") return "S";
  if (str === "M" || str === "MEDIUM" || str === "MED") return "M";
  if (str === "L" || str === "LARGE") return "L";
  if (str === "XL" || str === "X-LARGE" || str === "EXTRA LARGE") return "XL";
  if (str === "2XL" || str === "XXL" || str === "2X-LARGE" || str === "DOUBLE XL") return "2XL";
  return str;
};

const SizeChartCard = ({
  styleNumber = "10105",
  currentSize = "M",
  styleName = "",
  embeddedSizeChart = null,
  className = "",
  showFullscreenBtn = true,
  defaultView = "matrix"
}) => {
  const { isNo } = useLanguage();
  const [chartData, setChartData] = useState(embeddedSizeChart || null);
  const [loading, setLoading] = useState(!embeddedSizeChart);
  const [viewMode, setViewMode] = useState(defaultView); // "single", "matrix", "guide"
  const [selectedSizeKey, setSelectedSizeKey] = useState(normalizeSizeKey(currentSize) || "M");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (embeddedSizeChart) {
      setChartData(embeddedSizeChart);
      setLoading(false);
      return;
    }

    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getSizeChartByStyle(styleNumber);
        if (isMounted) {
          setChartData(data || null);
        }
      } catch {
        if (isMounted) {
          setChartData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [styleNumber, embeddedSizeChart]);

  useEffect(() => {
    if (currentSize) {
      const normalized = normalizeSizeKey(currentSize);
      if (normalized) setSelectedSizeKey(normalized);
    }
  }, [currentSize]);

  if (loading) {
    return (
      <SurfaceCard className={`p-6 animate-pulse ${className}`}>
        <div className="h-6 w-48 bg-slate-200 rounded-lg mb-4" />
        <div className="h-40 bg-slate-100 rounded-2xl" />
      </SurfaceCard>
    );
  }

  // If no size chart exists for this style, display empty state instead of wrong data
  if (!chartData || !chartData.sizes || chartData.sizes.length === 0) {
    return (
      <SurfaceCard className={`p-8 text-center space-y-4 border border-dashed border-slate-300 bg-slate-50/50 rounded-2xl ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
          <Ruler className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h4 className="text-base font-bold text-slate-800">
            {isNo
              ? `Ingen måleskjema registrert for Style #${styleNumber || ""}`
              : `No size chart configured for Style #${styleNumber || ""}`}
          </h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {isNo
              ? `Det er foreløpig ikke opprettet noe offisielt måleskjema for ${styleName || `Style #${styleNumber}`}. Ingen uriktige måledata vises for denne stilen.`
              : `There is no size chart added for ${styleName || `Style #${styleNumber}`} yet. No incorrect data is shown.`}
          </p>
        </div>
      </SurfaceCard>
    );
  }

  const chart = chartData;
  const activeNormalizedCurrent = normalizeSizeKey(currentSize);
  const activeSizeObj = chart.sizes.find((s) => s.key === selectedSizeKey) || chart.sizes[0];

  const handlePrintChart = () => {
    window.print();
  };

  // Clean specific title for ONLY the requested style
  const cleanTitle = styleName
    ? `Style #${styleNumber} - ${styleName} ${isNo ? "Måleskjema" : "Size Chart"}`
    : `Style #${styleNumber} ${isNo ? "Måleskjema & Spesifikasjoner" : "Pattern Specs & Size Chart"}`;

  return (
    <>
      <SurfaceCard
        className={`p-5 sm:p-7 space-y-5 border border-slate-200/90 shadow-sm relative transition-all duration-200 ${
          isFullscreen ? "fixed inset-4 z-50 overflow-y-auto bg-white shadow-2xl p-8" : ""
        } ${className}`}
      >
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {cleanTitle}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isNo
                    ? "Nøyaktige mål i centimeter (cm) med fargekodede størrelser og toleranseavvik."
                    : "Exact measurements in centimeters (cm) with size color-badges and tolerances."}
                </p>
              </div>
            </div>
          </div>

          {/* VIEW TOGGLE & ACTIONS */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/70 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("matrix")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === "matrix"
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>{isNo ? "Full Tabell" : "Full Table"}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("single")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === "single"
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isNo ? "Enkeltstørrelse" : "Single Size"}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("guide")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === "guide"
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{isNo ? "Måleguide" : "Guide"}</span>
              </button>
            </div>

            {showFullscreenBtn && (
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-xs transition"
                title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={handlePrintChart}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-xs transition"
              title="Print Size Chart"
            >
              <Printer className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>

        {/* 1. FULL MATRIX TABLE VIEW */}
        {viewMode === "matrix" && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-800 text-white font-bold tracking-wider">
                    <th className="py-3.5 px-4 sticky left-0 z-20 bg-slate-800 min-w-[200px] border-r border-slate-700">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Ruler className="w-3.5 h-3.5 text-blue-400" />
                        <span>{isNo ? "Kode & Målepunkt (cm)" : "Code & Measurement (cm)"}</span>
                      </div>
                    </th>
                    {chart.sizes.map((sz) => {
                      const bg = sz.bgLight || sz.colorHex || "#f1f5f9";
                      const isDarkBg = !sz.bgLight && (sz.colorBadge === "black" || sz.colorBadge === "navy" || sz.colorHex === "#1e293b" || sz.colorHex === "#0f172a");
                      const textColor = isDarkBg ? "#ffffff" : (sz.textHex && !sz.bgLight ? sz.textHex : "#0f172a");
                      return (
                        <th
                          key={sz.key}
                          className="py-3 px-3 text-center transition-all min-w-[75px]"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-mono text-sm font-extrabold text-white">{sz.label}</span>
                            <span
                              className="text-[10px] font-extrabold px-2 py-0.5 rounded-full capitalize shadow-xs border"
                              style={{
                                backgroundColor: bg,
                                color: textColor,
                                borderColor: sz.border || "rgba(0,0,0,0.15)"
                              }}
                            >
                              {sz.colorBadge}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                    <th className="py-3.5 px-3.5 text-center font-bold text-slate-300 min-w-[90px] border-l border-slate-700 bg-slate-800">
                      {isNo ? "Toleranse" : "Tolerance"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {chart.measurements.map((row, idx) => {
                    const isEven = idx % 2 === 0;
                    const displayName = isNo && row.norwegianName ? row.norwegianName : row.name;
                    return (
                      <tr
                        key={row.code}
                        className={`transition hover:bg-blue-50/50 ${isEven ? "bg-white" : "bg-slate-50/60"}`}
                      >
                        {/* Measurement Title */}
                        <td className={`py-3 px-4 font-semibold sticky left-0 z-10 border-r border-slate-200/80 ${isEven ? "bg-white" : "bg-slate-50"}`}>
                          <div className="flex items-center gap-2.5">
                            <span className="min-w-[26px] h-6 px-1.5 rounded-lg bg-blue-100 text-blue-800 font-bold font-mono text-[11px] inline-flex items-center justify-center shrink-0 shadow-2xs border border-blue-200/60 leading-none">
                              {row.code}
                            </span>
                            <div>
                              <span className="text-slate-900 font-bold block">{displayName}</span>
                              {row.name !== displayName && (
                                <span className="text-[10px] text-slate-400 block font-normal">{row.name}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Size Values */}
                        {chart.sizes.map((sz) => {
                          const val = row.values[sz.key] || "—";
                          return (
                            <td
                              key={sz.key}
                              className="py-3 px-3 text-center font-mono font-bold text-xs text-slate-700"
                            >
                              {val}
                            </td>
                          );
                        })}

                        {/* Tolerance */}
                        <td className="py-3 px-3 text-center font-mono text-[11px] font-bold text-slate-500 bg-slate-50/80 border-l border-slate-200/80">
                          <span className="bg-slate-200/80 px-2 py-0.5 rounded-md text-slate-700">
                            {row.tolerance || "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Applicable styles footnote */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2 pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <Info className="w-4 h-4 text-blue-600" />
                <span>
                  {isNo ? "Artikkelstil:" : "Garment Style:"}{" "}
                  <strong className="text-slate-800 font-mono">
                    #{styleNumber} {styleName ? `(${styleName})` : ""}
                  </strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {isNo ? "Mål er oppgitt i cm i henhold til standard produksjonsmønster." : "All measurements in cm per factory pattern spec."}
              </span>
            </div>
          </div>
        )}

        {/* 2. SINGLE SIZE BREAKDOWN VIEW */}
        {viewMode === "single" && (
          <div className="space-y-5">
            {/* Size Picker Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1">
                {isNo ? "Velg Størrelse:" : "Select Size:"}
              </span>
              {chart.sizes.map((sz) => {
                const isSelected = selectedSizeKey === sz.key;
                return (
                  <button
                    key={sz.key}
                    type="button"
                    onClick={() => setSelectedSizeKey(sz.key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isSelected
                        ? "shadow-md scale-105"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                    style={{
                      backgroundColor: isSelected ? sz.colorHex : undefined,
                      color: isSelected ? (sz.colorBadge === "black" ? "#fff" : sz.textHex || "#000") : undefined,
                      borderColor: isSelected ? sz.border || sz.colorHex : undefined
                    }}
                  >
                    <span>{sz.label}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                      style={{ backgroundColor: sz.colorHex }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Spec Cards Grid */}
            {(() => {
              const activeSizeObj = chart.sizes.find((s) => s.key === selectedSizeKey) || chart.sizes[0];
              return (
                <div className="space-y-4">
                  <div
                    className="p-4 rounded-2xl border flex items-center justify-between"
                    style={{
                      backgroundColor: activeSizeObj.bgLight || "#f8fafc",
                      borderColor: activeSizeObj.border || "#e2e8f0"
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono text-sm shadow-xs border"
                        style={{
                          backgroundColor: activeSizeObj.colorHex,
                          color: activeSizeObj.textHex || (activeSizeObj.colorBadge === "black" ? "#fff" : "#000"),
                          borderColor: activeSizeObj.border || "transparent"
                        }}
                      >
                        {activeSizeObj.key}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {activeSizeObj.label} {isNo ? "Målespesifikasjon" : "Spec Sheet"}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium">
                          {isNo ? "Fargemerke på plagg:" : "Garment Colour Tag:"}{" "}
                          <strong className="capitalize">{activeSizeObj.colorBadge}</strong>
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-white/80 border border-slate-200/80 rounded-xl text-xs font-bold font-mono text-slate-800 shadow-xs">
                      {isNo ? "Enhet" : "Unit"}: {chart.unit || "cm"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {chart.measurements.map((m) => {
                      const val = m.values[selectedSizeKey] || "—";
                      const displayName = isNo && m.norwegianName ? m.norwegianName : m.name;
                      return (
                        <div
                          key={m.code}
                          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-blue-400 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="min-w-[28px] h-7 px-2 rounded-lg bg-blue-50 text-blue-700 font-bold font-mono text-xs inline-flex items-center justify-center shrink-0 border border-blue-200/70 leading-none">
                              {m.code}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-800 leading-snug">{displayName}</p>
                              {m.tolerance && m.tolerance !== "—" && (
                                <p className="text-[10px] text-slate-400 font-mono">
                                  {isNo ? "Toleranse" : "Tol"}: {m.tolerance}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right pl-2">
                            <span className="text-base font-black font-mono text-blue-600">{val}</span>
                            <span className="text-[10px] font-bold text-slate-400 ml-1">{chart.unit || "cm"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 3. MEASUREMENT GUIDE TAB */}
        {viewMode === "guide" && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>
                {isNo ? "Hvordan ta mål av plagget (Måleveiledning):" : "How to Measure Your Garment (Factory Guide):"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                <p className="font-bold text-slate-900 mb-0.5">
                  {isNo ? "A - Brystvidde (Chest Width):" : "A - Chest Width:"}
                </p>
                <p className="text-slate-500">
                  {isNo
                    ? "Mål tvers over brystet foran fra armhulesøm til armhulesøm liggende flatt."
                    : "Measure across the front chest from armpit seam to armpit seam lying flat."}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                <p className="font-bold text-slate-900 mb-0.5">
                  {isNo ? "B - Bunnvidde (Width down):" : "B - Width down:"}
                </p>
                <p className="text-slate-500">
                  {isNo
                    ? "Mål horisontalt over nederkanten fra sidesøm til sidesøm."
                    : "Measure horizontally across the bottom hem opening from side seam to side seam."}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                <p className="font-bold text-slate-900 mb-0.5">
                  {isNo ? "C & D - Halsåpning bak og foran (Neck Openings):" : "C & D - Neck & V-Neck:"}
                </p>
                <p className="text-slate-500">
                  {isNo
                    ? "Halsåpning dybde målt fra øverste punkt bak (C) og spissen av front V-hals (D)."
                    : "Depth of neck opening measured from top point at back (C) and apex of front V-neck (D)."}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                <p className="font-bold text-slate-900 mb-0.5">
                  {isNo ? "E - Rygglengde fra hals (Back length):" : "E - Back length:"}
                </p>
                <p className="text-slate-500">
                  {isNo
                    ? "Lengde målt vertikalt fra midt bak i halssømmen ned til nederkant."
                    : "Length measured vertically from center back neck seam down to the bottom hem."}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                <p className="font-bold text-slate-900 mb-0.5">
                  {isNo ? "F & H - Ermelengde & Ermevidde (Sleeve Specs):" : "F & H - Sleeve Length & Width:"}
                </p>
                <p className="text-slate-500">
                  {isNo
                    ? "Ermelengde (F) fra halskant til mansjett; ermevidde (H) over overarm."
                    : "Sleeve length (F) from neck edge to cuff; sleeve width (H) across bicep opening."}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                <p className="font-bold text-slate-900 mb-0.5">
                  {isNo ? "I - Avstand brystlomme (Pocket Distance):" : "I - Chest Pocket Distance:"}
                </p>
                <p className="text-slate-500">
                  {isNo
                    ? "Avstand i centimeter fra sidesøm til ytterkanten av brystlommen."
                    : "Distance in centimeters from side seam to the outer edge of the chest pocket."}
                </p>
              </div>
            </div>
          </div>
        )}
      </SurfaceCard>
    </>
  );
};

export default SizeChartCard;
