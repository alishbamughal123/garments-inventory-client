import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Printer, FileSpreadsheet, Layers, Filter, Check } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import DeleteModal from "../../components/common/DeleteModal";
import SearchBar from "../../components/products/SearchBar";
import ProductTable from "../../components/products/ProductTable";
import BarcodePrintModal from "../../components/products/BarcodePrintModal";
import Loader from "../../components/ui/Loader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import {
  deleteProduct,
  getProducts,
  searchProducts,
} from "../../services/products.service";
import { exportArticlesToExcelWithBarcodes } from "../../utils/barcodeExport";
import toast from "react-hot-toast";

const ProductsPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStyleFilter, setSelectedStyleFilter] = useState("ALL");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        if (!search.trim()) {
          const response = await getProducts();
          setProducts(response.data || []);
          return;
        }

        const response = await searchProducts(search);
        setProducts(response.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  // Extract unique base styles for fast filtering (e.g. 10101, 10102)
  const uniqueBaseStyles = Array.from(
    new Set(
      products
        .map((p) => p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : null))
        .filter(Boolean)
    )
  );

  // Filter products by selected base style if applicable
  const filteredProducts =
    selectedStyleFilter === "ALL"
      ? products
      : products.filter((p) => {
          const base =
            p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : "");
          return base === selectedStyleFilter;
        });

  const handleExportAllExcel = async () => {
    if (filteredProducts.length === 0) {
      toast.error("No articles to export.");
      return;
    }

    try {
      setExportingExcel(true);
      setExportProgress(0);
      toast.loading("Generating Excel sheet with embedded barcodes...", { id: "excel-toast" });

      const filterSuffix =
        selectedStyleFilter !== "ALL" ? `_Style_${selectedStyleFilter}` : "_All_Articles";

      await exportArticlesToExcelWithBarcodes({
        products: filteredProducts,
        fileName: `Nordic_Inventory_Barcodes${filterSuffix}`,
        sheetName: selectedStyleFilter !== "ALL" ? `Style ${selectedStyleFilter}` : "All Articles",
        onProgress: (percent, current, total) => {
          setExportProgress({ percent, current, total });
        },
      });

      toast.success(
        `Successfully exported ${filteredProducts.length} articles with barcode images!`,
        { id: "excel-toast" }
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to export Excel file", { id: "excel-toast" });
    } finally {
      setExportingExcel(false);
      setExportProgress(null);
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

      toast.success("Article deleted successfully");
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete article"
      );
    }
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* PAGE HEADER */}
        <PageHeader
          title="Articles & Barcodes"
          description="Manage apparel products, variants, embedded barcode sheets, and thermal label printing."
          action={
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* 1-Click Excel with Barcodes */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportAllExcel}
                disabled={exportingExcel || filteredProducts.length === 0}
                className="inline-flex items-center justify-center gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 shadow-sm text-xs font-semibold py-2.5 px-3 w-full sm:w-auto"
                title="Download Excel spreadsheet with embedded high-resolution barcode images"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {exportingExcel
                    ? `Exporting (${exportProgress?.current || 0}/${exportProgress?.total || filteredProducts.length})...`
                    : "Excel (+ Barcodes)"}
                </span>
              </Button>

              {/* 1-Click Print Barcode Labels Sheet */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPrintModalOpen(true)}
                disabled={filteredProducts.length === 0}
                className="inline-flex items-center justify-center gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm text-xs font-semibold py-2.5 px-3 w-full sm:w-auto"
                title="Open printable barcode sticker labels sheet (A4 / Thermal)"
              >
                <Printer className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">Print Labels Sheet</span>
              </Button>

              {/* Add Article Button (Spans full width on mobile 2-col grid) */}
              <Button
                onClick={() => navigate("/products/add")}
                size="sm"
                className="col-span-2 sm:col-auto inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 py-2.5 px-4 font-semibold text-xs sm:text-sm w-full sm:w-auto"
              >
                <FiPlus size={18} className="shrink-0" />
                <span>Add Article</span>
              </Button>
            </div>
          }
        />

        {/* SEARCH & FILTERS TOOLBAR CARD */}
        <SurfaceCard className="p-3 sm:p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
              <SearchBar
                search={search}
                setSearch={setSearch}
              />
            </div>

            {/* Total count badge */}
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 shrink-0">
              <span>Showing:</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800 font-mono">
                {filteredProducts.length} / {products.length} articles
              </span>
            </div>
          </div>

          {/* Quick Style Filter Tabs (e.g. 10101, 10102) */}
          {uniqueBaseStyles.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 text-[11px]">
                <Filter className="w-3 h-3 text-slate-400" /> Styles:
              </span>
              <button
                onClick={() => setSelectedStyleFilter("ALL")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 ${
                  selectedStyleFilter === "ALL"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100/70 border border-slate-200 text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                All Articles ({products.length})
              </button>
              {uniqueBaseStyles.map((style) => {
                const count = products.filter((p) => {
                  const base =
                    p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : "");
                  return base === style;
                }).length;
                const isSelected = selectedStyleFilter === style;
                return (
                  <button
                    key={style}
                    onClick={() => setSelectedStyleFilter(style)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100/70 border border-slate-200 text-slate-600 hover:bg-slate-200/60"
                    }`}
                  >
                    <span>Style #{style}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                        isSelected ? "bg-indigo-800 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </SurfaceCard>

        {/* ARTICLES TABLE */}
        {loading ? (
          <Loader message="Loading apparel articles..." />
        ) : (
          <div className="bg-transparent sm:bg-white rounded-2xl border-0 sm:border border-slate-200 shadow-none sm:shadow-sm p-0 sm:p-6">
            <ProductTable
              products={filteredProducts}
              onDelete={openDeleteModal}
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
        title="Delete Article"
        message={`Are you sure you want to delete ${
          selectedProduct?.styleNumber ||
          selectedProduct?.productName ||
          "this article"
        }? This action cannot be undone.`}
      />

      {/* 1-CLICK BARCODE PRINT MODAL */}
      <BarcodePrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        products={filteredProducts}
        title={
          selectedStyleFilter !== "ALL"
            ? `Print Barcodes - Style #${selectedStyleFilter}`
            : "Print Barcode Labels (All Articles)"
        }
      />
    </MainLayout>
  );
};

export default ProductsPage;
