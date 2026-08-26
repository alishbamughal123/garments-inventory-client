import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Printer, FileSpreadsheet, Layers, Filter, ChevronDown, X, FileCode, Boxes, Calculator } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import DeleteModal from "../../components/common/DeleteModal";
import SearchBar from "../../components/products/SearchBar";
import ProductTable from "../../components/products/ProductTable";
import BarcodePrintModal from "../../components/products/BarcodePrintModal";
import CostPriceModal from "../../components/products/CostPriceModal";
import Loader from "../../components/ui/Loader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import Pagination from "../../components/common/Pagination";
import { useLanguage } from "../../context/LanguageContext";
import {
  deleteProduct,
  getProducts,
  getBaseStyles,
} from "../../services/products.service";
import { exportArticlesToExcelWithBarcodes } from "../../utils/barcodeExport";
import { downloadCAD_DXF, downloadCAD_SVG } from "../../utils/cadExport";
import toast from "react-hot-toast";

const ProductsPage = () => {
  const navigate = useNavigate();
  const { t, isNo } = useLanguage();

  const [products, setProducts] = useState([]);
  const [baseStyles, setBaseStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStyleFilter, setSelectedStyleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [costPriceModalOpen, setCostPriceModalOpen] = useState(false);
  const [printModalMode, setPrintModalMode] = useState("individual");
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const [modalProducts, setModalProducts] = useState([]);
  const [fetchingModalData, setFetchingModalData] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load distinct base styles for the dropdown filter
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const res = await getBaseStyles();
        setBaseStyles(res.data || []);
      } catch (err) {
        console.error("Failed to load base styles", err);
      }
    };
    fetchStyles();
  }, []);

  // Fetch paginated products with debounce on search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await getProducts({
          page,
          limit: pageSize,
          search: search.trim(),
          styleFilter: selectedStyleFilter,
        });

        const items = Array.isArray(response.data)
          ? response.data
          : response.data?.products || [];

        const total = response.pagination?.total || items.length;
        const totalPages = response.pagination?.totalPages || Math.max(1, Math.ceil(total / pageSize));

        // If backend returned more than pageSize (e.g. non-paginated API fallback), slice defensively
        const displayItems = (items.length > pageSize)
          ? items.slice((page - 1) * pageSize, page * pageSize)
          : items;

        setProducts(displayItems);

        setPaginationMeta(response.pagination || {
          total,
          page,
          limit: pageSize,
          totalPages,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(isNo ? "Kunne ikke laste artikler" : "Failed to load articles");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [page, pageSize, search, selectedStyleFilter, refreshTrigger, isNo]);

  // Helper to fetch complete matching products for bulk actions (Export / Print)
  const getFullFilteredProducts = async () => {
    if (paginationMeta.total <= products.length && page === 1) {
      return products;
    }
    const response = await getProducts({
      all: "true",
      search: search.trim(),
      styleFilter: selectedStyleFilter,
    });
    return Array.isArray(response.data) ? response.data : response.data?.products || [];
  };

  const handleExportAllExcel = async () => {
    if (paginationMeta.total === 0) {
      toast.error(isNo ? "Ingen artikler å eksportere." : "No articles to export.");
      return;
    }

    try {
      setExportingExcel(true);
      setExportProgress(0);
      toast.loading(
        isNo
          ? "Henter alle artikler og genererer Excel-ark med strekkoder..."
          : "Fetching all articles and generating Excel sheet with barcodes...",
        { id: "excel-toast" }
      );

      const allItems = await getFullFilteredProducts();
      const filterSuffix =
        selectedStyleFilter !== "ALL" ? `_Style_${selectedStyleFilter}` : "_All_Articles";

      await exportArticlesToExcelWithBarcodes({
        products: allItems,
        fileName: `Nordic_Inventory_Barcodes${filterSuffix}`,
        sheetName: selectedStyleFilter !== "ALL" ? `Style ${selectedStyleFilter}` : (isNo ? "Alle artikler" : "All Articles"),
        onProgress: (percent, current, total) => {
          setExportProgress({ percent, current, total });
        },
      });

      toast.success(
        isNo
          ? `Eksporterte ${allItems.length} artikler med strekkodebilder!`
          : `Successfully exported ${allItems.length} articles with barcode images!`,
        { id: "excel-toast" }
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message || (isNo ? "Kunne ikke eksportere Excel-fil" : "Failed to export Excel file"), { id: "excel-toast" });
    } finally {
      setExportingExcel(false);
      setExportProgress(null);
    }
  };

  const handleExportAllCAD_DXF = async () => {
    if (paginationMeta.total === 0) {
      toast.error(isNo ? "Ingen artikler å eksportere." : "No articles to export.");
      return;
    }

    try {
      toast.loading(isNo ? "Genererer CAD (.dxf) fil..." : "Generating CAD (.dxf) file...", { id: "cad-toast" });
      const allItems = await getFullFilteredProducts();
      const filterSuffix =
        selectedStyleFilter !== "ALL" ? `_Style_${selectedStyleFilter}` : "_All_Articles";

      downloadCAD_DXF({
        products: allItems,
        fileName: `Nordic_Inventory_Barcodes_CAD${filterSuffix}`,
      });
      toast.success(
        isNo
          ? `Eksporterte ${allItems.length} artikler til AutoCAD DXF CAD-fil!`
          : `Exported ${allItems.length} articles to AutoCAD DXF CAD file!`,
        { id: "cad-toast" }
      );
    } catch (error) {
      console.error(error);
      toast.error(isNo ? "Kunne ikke generere CAD-fil" : "Failed to generate CAD file", { id: "cad-toast" });
    }
  };

  const handleExportAllCAD_SVG = async () => {
    if (paginationMeta.total === 0) {
      toast.error(isNo ? "Ingen artikler å eksportere." : "No articles to export.");
      return;
    }

    try {
      toast.loading(isNo ? "Genererer Vector (.svg) fil..." : "Generating Vector (.svg) file...", { id: "svg-toast" });
      const allItems = await getFullFilteredProducts();
      const filterSuffix =
        selectedStyleFilter !== "ALL" ? `_Style_${selectedStyleFilter}` : "_All_Articles";

      downloadCAD_SVG({
        products: allItems,
        fileName: `Nordic_Inventory_Barcodes_Vector_CAD${filterSuffix}`,
      });
      toast.success(
        isNo
          ? `Eksporterte ${allItems.length} artikler til Vector CAD (.svg) fil!`
          : `Exported ${allItems.length} articles to Vector CAD (.svg) file!`,
        { id: "svg-toast" }
      );
    } catch (error) {
      console.error(error);
      toast.error(isNo ? "Kunne ikke generere SVG CAD-fil" : "Failed to generate SVG CAD file", { id: "svg-toast" });
    }
  };

  const handleOpenPrintModal = async (mode) => {
    try {
      setFetchingModalData(true);
      setPrintModalMode(mode);
      const allItems = await getFullFilteredProducts();
      setModalProducts(allItems);
      setPrintModalOpen(true);
    } catch (err) {
      console.error("Failed to load products for print modal", err);
      toast.error(isNo ? "Kunne ikke hente artikler for utskrift" : "Failed to load articles for printing");
    } finally {
      setFetchingModalData(false);
    }
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProduct(selectedProduct.id);

      setProducts((prev) =>
        prev.filter((product) => product.id !== selectedProduct.id)
      );
      setPaginationMeta((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));

      toast.success(isNo ? "Artikkel ble slettet" : "Article deleted successfully");
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || (isNo ? "Kunne ikke slette artikkel" : "Failed to delete article")
      );
    }
  };

  return (
    <MainLayout>
      <div className="space-y-5">
        {/* CLEAN PAGE HEADER WITH PRIMARY ACTION */}
        <PageHeader
          title={t("articlesAndBarcodes")}
          description={t("articlesPageDesc")}
          action={
            <button
              type="button"
              onClick={() => navigate("/products/add")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              <FiPlus size={16} className="shrink-0" />
              <span>{t("addArticle")}</span>
            </button>
          }
        />

        {/* TOOLS & EXPORT ACTIONS BAR */}
        <SurfaceCard className="p-3 sm:p-3.5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Export Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
                {isNo ? "Eksport:" : "Export:"}
              </span>

              {/* Excel Export Button */}
              <button
                type="button"
                onClick={handleExportAllExcel}
                disabled={exportingExcel || paginationMeta.total === 0}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 px-3 py-2 text-xs sm:text-sm font-semibold shadow-2xs transition disabled:opacity-50 disabled:cursor-not-allowed"
                title={isNo ? "Last ned Excel-regneark med strekkoder" : "Download Excel spreadsheet with barcodes"}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {exportingExcel
                    ? (isNo
                        ? `Eksporterer (${exportProgress?.current || 0}/${exportProgress?.total || paginationMeta.total})...`
                        : `Exporting (${exportProgress?.current || 0}/${exportProgress?.total || paginationMeta.total})...`)
                    : t("excelWithBarcodes")}
                </span>
              </button>

              {/* CAD DXF Export Button */}
              <button
                type="button"
                onClick={handleExportAllCAD_DXF}
                disabled={paginationMeta.total === 0}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-2 text-xs sm:text-sm font-semibold text-indigo-700 shadow-2xs transition hover:bg-indigo-100 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title={isNo ? "Last ned AutoCAD DXF CAD-fil" : "Download AutoCAD DXF CAD file"}
              >
                <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>CAD (.dxf)</span>
              </button>

              {/* Vector SVG Button */}
              <button
                type="button"
                onClick={handleExportAllCAD_SVG}
                disabled={paginationMeta.total === 0}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50/70 px-3 py-2 text-xs sm:text-sm font-semibold text-violet-700 shadow-2xs transition hover:bg-violet-100 hover:border-violet-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title={isNo ? "Last ned Vector SVG-fil" : "Download Vector SVG CAD file"}
              >
                <Layers className="w-4 h-4 text-violet-600 shrink-0" />
                <span>Vector (.svg)</span>
              </button>
            </div>

            {/* Printing & Management Tools */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
                {isNo ? "Verktøy:" : "Tools:"}
              </span>

              {/* Print Labels Sheet Button */}
              <button
                type="button"
                onClick={() => handleOpenPrintModal("individual")}
                disabled={paginationMeta.total === 0 || fetchingModalData}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title={isNo ? "Åpne utskriftsklare strekkodeetiketter" : "Open printable barcode sticker labels"}
              >
                <Printer className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{t("printLabels")}</span>
              </button>

              {/* Mixed Carton (Last Box) Button */}
              <button
                type="button"
                onClick={() => handleOpenPrintModal("mixed_carton")}
                disabled={paginationMeta.total === 0 || fetchingModalData}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 text-xs sm:text-sm font-semibold shadow-2xs transition disabled:opacity-50 disabled:cursor-not-allowed"
                title={isNo ? "Blandet kartong strekkode (restvarer)" : "Mixed sizes carton sticker for leftover box"}
              >
                <Boxes className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{t("mixedCarton")}</span>
              </button>

              {/* Cost Price Manager & Calculator Button */}
              <button
                type="button"
                onClick={() => setCostPriceModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 px-3.5 py-2 text-xs sm:text-sm font-semibold shadow-2xs transition"
                title={isNo ? "Kostprisbehandler & Valutakalkulator" : "Cost Price Manager & Calculator"}
              >
                <Calculator className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{t("costPriceManager")}</span>
              </button>
            </div>
          </div>
        </SurfaceCard>

        {/* TOOLBAR: SEARCH & STYLE FILTER */}
        <SurfaceCard className="p-3.5 sm:p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
              <SearchBar
                search={search}
                setSearch={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                placeholder={
                  isNo
                    ? "Søk etter stilnr, navn, artikkel, SKU eller strekkode..."
                    : "Search by style no, name, article, SKU, or barcode..."
                }
              />
            </div>

            {/* Clean Style Filter Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative min-w-[210px] sm:min-w-[250px]">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Filter size={15} />
                </div>
                <select
                  id="style-filter-select"
                  value={selectedStyleFilter}
                  onChange={(e) => {
                    setSelectedStyleFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white py-2.5 pl-9 pr-9 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs outline-none transition hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  <option value="ALL">
                    {isNo
                      ? `Alle stiler (${paginationMeta.total} totalt)`
                      : `All Styles (${paginationMeta.total} total)`}
                  </option>
                  {baseStyles.map((style) => (
                    <option key={style} value={style}>
                      {isNo ? `Stil #${style}` : `Style #${style}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Reset to All Button */}
              {selectedStyleFilter !== "ALL" && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStyleFilter("ALL");
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/80 transition flex items-center gap-1.5 shrink-0"
                  title={isNo ? "Tilbakestill filter og vis alle stiler" : "Clear filter and show all styles"}
                >
                  <X size={14} />
                  <span>{isNo ? "Alle" : "All"}</span>
                </button>
              )}

              {/* Active Counter Pill */}
              <div className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs font-semibold text-blue-900 shrink-0 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>
                  {isNo ? "Side" : "Page"} <strong className="font-bold text-blue-700">{page}</strong> {isNo ? "av" : "of"} <strong className="font-bold text-blue-700">{paginationMeta.totalPages}</strong>
                </span>
                <span className="text-blue-400">•</span>
                <span className="text-slate-600 font-normal">
                  ({isNo ? "Viser" : "Showing"} {products.length} {isNo ? "av" : "of"} {paginationMeta.total} {isNo ? "totalt" : "total"})
                </span>
              </div>
            </div>
          </div>
        </SurfaceCard>

        {/* ARTICLES TABLE */}
        {loading ? (
          <Loader message={isNo ? "Laster klesartikler..." : "Loading apparel articles..."} />
        ) : (
          <div className="bg-transparent sm:bg-white rounded-2xl border-0 sm:border border-slate-200 shadow-none sm:shadow-sm p-0 sm:p-6 space-y-4">
            {/* Top Pagination Bar */}
            {paginationMeta.total > 0 && (
              <Pagination
                currentPage={page}
                totalPages={paginationMeta.totalPages}
                totalItems={paginationMeta.total}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(1);
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                itemLabel="articles"
                itemLabelNo="artikler"
                className="pt-0 border-t-0 pb-3 border-b border-slate-100"
              />
            )}

            <ProductTable
              products={products}
              onDelete={openDeleteModal}
            />

            {/* Reusable Pagination */}
            <Pagination
              currentPage={page}
              totalPages={paginationMeta.totalPages}
              totalItems={paginationMeta.total}
              pageSize={pageSize}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              itemLabel="articles"
              itemLabelNo="artikler"
            />
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDelete}
        title={t("deleteArticle")}
        message={
          isNo
            ? `Er du sikker på at du vil slette ${
                selectedProduct?.styleNumber ||
                selectedProduct?.productName ||
                "denne artikkelen"
              }? Denne handlingen kan ikke angres.`
            : `Are you sure you want to delete ${
                selectedProduct?.styleNumber ||
                selectedProduct?.productName ||
                "this article"
              }? This action cannot be undone.`
        }
      />

      {/* 1-CLICK BARCODE PRINT MODAL */}
      <BarcodePrintModal
        isOpen={printModalOpen}
        onClose={() => {
          setPrintModalOpen(false);
          setModalProducts([]);
        }}
        products={modalProducts.length > 0 ? modalProducts : products}
        initialMode={printModalMode}
        title={
          printModalMode === "mixed_carton"
            ? (isNo ? `Strekkode for blandet kartong (Rest) - ${selectedStyleFilter !== "ALL" ? `Stil #${selectedStyleFilter}` : "Alle artikler"}` : `Mixed Carton Barcode Sticker (Last Box) - ${selectedStyleFilter !== "ALL" ? `Style #${selectedStyleFilter}` : "All Articles"}`)
            : selectedStyleFilter !== "ALL"
            ? (isNo ? `Skriv ut strekkoder - Stil #${selectedStyleFilter}` : `Print Barcodes - Style #${selectedStyleFilter}`)
            : (isNo ? "Skriv ut strekkoder (Alle artikler)" : "Print Barcode Labels (All Articles)")
        }
      />

      {/* COST PRICE MANAGER & CALCULATOR MODAL */}
      <CostPriceModal
        isOpen={costPriceModalOpen}
        onClose={() => setCostPriceModalOpen(false)}
        baseStyles={baseStyles}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </MainLayout>
  );
};

export default ProductsPage;
