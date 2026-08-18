import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Printer, FileSpreadsheet, Layers, Filter, ChevronDown, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
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

  // Extract unique base styles (e.g. 10101, 10102)
  const uniqueBaseStyles = Array.from(
    new Set(
      products
        .map((p) => p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : null))
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // Priority styles to show as top quick tabs
  const priorityStyles = ["10099", "10101", "10102", "10123", "10124", "200124"].filter((s) => uniqueBaseStyles.includes(s));

  // Filter products by selected base style
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
      <div className="space-y-5">
        {/* CLEAN PAGE HEADER */}
        <PageHeader
          title="Articles & Barcodes"
          description="Manage apparel products, variants, barcode sheets, and label printing."
          action={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              {/* Excel Export Button */}
              <button
                type="button"
                onClick={handleExportAllExcel}
                disabled={exportingExcel || filteredProducts.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download Excel spreadsheet with embedded barcode images"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {exportingExcel
                    ? `Exporting (${exportProgress?.current || 0}/${exportProgress?.total || filteredProducts.length})...`
                    : "Excel (+ Barcodes)"}
                </span>
              </button>

              {/* Print Labels Sheet Button */}
              <button
                type="button"
                onClick={() => setPrintModalOpen(true)}
                disabled={filteredProducts.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Open printable barcode sticker labels sheet (A4 / Thermal)"
              >
                <Printer className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Print Labels</span>
              </button>

              {/* Primary Add Article Button */}
              <button
                type="button"
                onClick={() => navigate("/products/add")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition"
              >
                <FiPlus size={18} className="shrink-0" />
                <span>Add Article</span>
              </button>
            </div>
          }
        />

        {/* TOOLBAR: SEARCH & STYLE FILTER */}
        <SurfaceCard className="p-3.5 sm:p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
              <SearchBar
                search={search}
                setSearch={setSearch}
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
                  onChange={(e) => setSelectedStyleFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white py-2.5 pl-9 pr-9 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs outline-none transition hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  <option value="ALL">
                    All Styles ({products.length} total)
                  </option>
                  {uniqueBaseStyles.map((style) => {
                    const count = products.filter((p) => {
                      const base =
                        p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : "");
                      return base === style;
                    }).length;
                    return (
                      <option key={style} value={style}>
                        Style #{style} ({count} {count === 1 ? "variant" : "variants"})
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Reset to All Button */}
              {selectedStyleFilter !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedStyleFilter("ALL")}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/80 transition flex items-center gap-1.5 shrink-0"
                  title="Clear filter and show all styles"
                >
                  <X size={14} />
                  <span>All</span>
                </button>
              )}

              {/* Active Counter Pill */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100/70 border border-slate-200/60 text-xs font-medium text-slate-600 shrink-0">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="font-mono font-bold text-slate-900">
                  {filteredProducts.length}
                </span>
                <span>{filteredProducts.length === 1 ? "variant" : "variants"}</span>
              </div>
            </div>
          </div>
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
