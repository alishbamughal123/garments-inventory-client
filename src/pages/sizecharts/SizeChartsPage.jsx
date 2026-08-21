import { useState, useEffect, useMemo } from "react";
import {
  Ruler,
  Plus,
  Search,
  Filter,
  Layers,
  Sparkles,
  Printer,
  Edit,
  Package,
  CheckCircle2,
  Tag
} from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import SizeChartCard from "../../components/products/SizeChartCard";
import SizeChartModal from "../../components/products/SizeChartModal";
import { getProducts } from "../../services/products.service";
import { getAllSizeCharts } from "../../services/sizechart.service";
import { useLanguage } from "../../context/LanguageContext";

const SizeChartsPage = () => {
  const { t, isNo } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [sizeCharts, setSizeCharts] = useState([]);
  const [selectedStyleNumber, setSelectedStyleNumber] = useState("10105");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChartData, setEditingChartData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, charts] = await Promise.all([
        getProducts().catch(() => ({ data: [] })),
        getAllSizeCharts().catch(() => []),
      ]);
      setProducts(prodRes?.data || []);
      setSizeCharts(charts || []);
    } catch (err) {
      console.error("Failed to load size charts page data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group products by base style
  const uniqueStyles = useMemo(() => {
    const map = new Map();

    // Add seeded default styles with size charts first
    map.set("10099", { styleNumber: "10099", styleName: "Nordic Mopp 60 - Mopp 60 cm", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10101", { styleNumber: "10101", styleName: "Sandefjord - Pique Polo / Tee", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10102", { styleNumber: "10102", styleName: "Tønsberg - Polo Shirt", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10105", { styleNumber: "10105", styleName: "Lillehammer - Scrubs unisex NS3361", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10106", { styleNumber: "10106", styleName: "Stavanger - Scrub overdel", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10116", { styleNumber: "10116", styleName: "Hamar - Trouser Unisex NS3357", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10107", { styleNumber: "10107", styleName: "Hamar - Healthcare bukse", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10108", { styleNumber: "10108", styleName: "Bergen - Trouser Unisex NS3357", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10109", { styleNumber: "10109", styleName: "Ålesund - Coat", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10122", { styleNumber: "10122", styleName: "Kalmar - Fleece Jakke", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10123", { styleNumber: "10123", styleName: "Bodø - Fleece Vest", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("10124", { styleNumber: "10124", styleName: "Oslo - Workwear Bukse", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("20110", { styleNumber: "20110", styleName: "Stockholm", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("20111", { styleNumber: "20111", styleName: "Borås", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("200120", { styleNumber: "200120", styleName: "Odense", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("200121", { styleNumber: "200121", styleName: "Vejle", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("200122", { styleNumber: "200122", styleName: "Skagen", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("200123", { styleNumber: "200123", styleName: "Åre", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("200124", { styleNumber: "200124", styleName: "Piteå", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("200125", { styleNumber: "200125", styleName: "Umeå", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("200126", { styleNumber: "200126", styleName: "Arendal / Luleå", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });
    map.set("200127", { styleNumber: "200127", styleName: "Haugesund / Risør", brand: "Nordic Prowear", hasChart: true, variantsCount: 0 });

    const CONFIGURED_STYLES = [
      "10099", "10101", "10102", "10105", "10106", "10116", "10107", "10108", "10109",
      "10122", "10123", "10124",
      "20110", "20111", "200120", "200121", "200122",
      "200123", "200124", "200125", "200126", "200127"
    ];

    products.forEach((p) => {
      const base = p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : null);
      if (base) {
        const isConfigured = CONFIGURED_STYLES.includes(base) || Boolean(p.sizeChart);
        if (isConfigured) {
          const existing = map.get(base) || {
            styleNumber: base,
            styleName: p.styleName || p.productName?.split("-")[0]?.trim() || `Style #${base}`,
            brand: p.brand || "Nordic Prowear",
            hasChart: true,
            variantsCount: 0,
          };
          existing.variantsCount += 1;
          if (p.styleName && !map.has(base)) existing.styleName = p.styleName;
          map.set(base, existing);
        }
      }
    });

    return Array.from(map.values());
  }, [products]);

  // Filtered styles by search
  const filteredStyles = useMemo(() => {
    let list = uniqueStyles;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.styleNumber.toLowerCase().includes(q) ||
          (s.styleName && s.styleName.toLowerCase().includes(q))
      );
    }
    return list;
  }, [uniqueStyles, searchQuery]);

  const activeStyleObj = useMemo(() => {
    return uniqueStyles.find((s) => s.styleNumber === selectedStyleNumber) || uniqueStyles[0];
  }, [uniqueStyles, selectedStyleNumber]);

  const currentStyleNumber = activeStyleObj?.styleNumber || selectedStyleNumber || "10105";

  const handleOpenAddModal = () => {
    setEditingChartData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = () => {
    const existing = sizeCharts.find((c) => c.styleNumber === currentStyleNumber);
    setEditingChartData({
      styleNumber: currentStyleNumber,
      styleName: activeStyleObj?.styleName || "",
      ...existing,
    });
    setIsModalOpen(true);
  };

  const handleChartSaved = () => {
    fetchData();
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        {/* PAGE HEADER */}
        <PageHeader
          title={isNo ? "Artikkel Måleskjema & Spesifikasjoner" : "Article Size Charts & Measurement Matrix"}
          description={
            isNo
              ? "Standardiserte produksjonsmønstre, fargekodede størrelser, toleranseavvik og måletabeller for hver klesstil."
              : "Standardized factory patterns, size color tags, tolerance allowances, and full comparison matrices for each style."
          }
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>{isNo ? "Skriv ut" : "Print"}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isNo ? "+ Legg til Måleskjema" : "+ Add Size Chart"}</span>
              </button>
            </div>
          }
        />

        {/* STYLE SELECTOR & SEARCH BAR */}
        <SurfaceCard className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isNo ? "Velg Stil / Artikkel" : "Select Garment Style"}
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isNo ? "Søk etter stil eller navn..." : "Search style or name..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-8 pr-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Style Quick Picker Buttons */}
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pt-1">
            {filteredStyles.map((style) => {
              const isSelected = currentStyleNumber === style.styleNumber;
              return (
                <button
                  key={style.styleNumber}
                  type="button"
                  onClick={() => setSelectedStyleNumber(style.styleNumber)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-102"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-mono">#{style.styleNumber}</span>
                  <span className="text-slate-400 font-normal truncate max-w-[140px]">
                    {style.styleName}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </SurfaceCard>

        {/* ACTIVE STYLE HEADER & ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-xs">
              #{currentStyleNumber}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {activeStyleObj?.styleName || `Style #${currentStyleNumber}`}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isNo ? "Merke:" : "Brand:"} <strong className="text-slate-700">{activeStyleObj?.brand || "Nordic Prowear"}</strong> • 
                {isNo ? " Gjeldende artikkelkode:" : " Applicable Article Code:"} <strong className="text-slate-700 font-mono">{currentStyleNumber}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenEditModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold shadow-2xs transition self-start sm:self-auto cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{isNo ? "Rediger Måleskjema" : "Edit Measurements"}</span>
          </button>
        </div>

        {/* MAIN FULL COMPARISON MATRIX TABLE VIEW */}
        <SizeChartCard
          key={currentStyleNumber}
          styleNumber={currentStyleNumber}
          styleName={activeStyleObj?.styleName}
          showFullscreenBtn={true}
        />

        {/* SIZE CHART CREATION / EDITING MODAL */}
        <SizeChartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleChartSaved}
          initialData={editingChartData}
        />
      </div>
    </MainLayout>
  );
};

export default SizeChartsPage;
