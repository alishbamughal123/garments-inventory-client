import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Printer, FileSpreadsheet, Layers, Filter } from "lucide-react";
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
  const priorityStyles = ["10101", "10102"].filter((s) => uniqueBaseStyles.includes(s));

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

            {/* Style Filter Dropdown & Quick Tabs */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Quick Tab: All Articles */}
              <button
                type="button"
                onClick={() => setSelectedStyleFilter("ALL")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedStyleFilter === "ALL"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 border border-slate-200/60"
                }`}
              >
                All ({products.length})
              </button>

              {/* Quick Tabs for Main Styles (e.g. 10101, 10102) */}
              {priorityStyles.map((style) => {
                const count = products.filter((p) => {
                  const base =
                    p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : "");
                  return base === style;
                }).length;
                const isSelected = selectedStyleFilter === style;
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSelectedStyleFilter(style)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 border border-slate-200/60"
                    }`}
                  >
                    <span>Style #{style}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                        isSelected ? "bg-blue-800 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              {/* All other styles dropdown */}
              {uniqueBaseStyles.length > priorityStyles.length && (
                <div className="relative">
                  <select
                    value={priorityStyles.includes(selectedStyleFilter) || selectedStyleFilter === "ALL" ? "" : selectedStyleFilter}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedStyleFilter(e.target.value);
                      }
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none transition hover:bg-white focus:border-blue-400 focus:bg-white"
                  >
                    <option value="">More Styles ({uniqueBaseStyles.length - priorityStyles.length})...</option>
                    {uniqueBaseStyles
                      .filter((s) => !priorityStyles.includes(s))
                      .map((style) => {
                        const count = products.filter((p) => {
                          const base =
                            p.baseStyleNumber || (p.styleNumber ? p.styleNumber.split("-")[0] : "");
                          return base === style;
                        }).length;
                        return (
                          <option key={style} value={style}>
                            Style #{style} ({count} items)
                          </option>
                        );
                      })}
                  </select>
                </div>
              )}

              {/* Counter Badge */}
              <div className="hidden lg:flex items-center text-xs text-slate-500 pl-1 font-medium">
                <span className="font-mono font-semibold text-slate-800">
                  {filteredProducts.length}
                </span>
                <span className="ml-1">articles</span>
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
