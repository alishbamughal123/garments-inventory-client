import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiAlertTriangle, FiBox } from "react-icons/fi";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import Pagination from "../../components/common/Pagination";
import { getLowStockProducts } from "../../services/products.service";
import { formControlClass } from "../../components/ui/formStyles";
import { useLanguage } from "../../context/LanguageContext";

const LowStockPage = () => {
  const { isNo } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });

  const fetchLowStock = async (pageToFetch = page, pageSizeToFetch = pageSize, currentSearch = search) => {
    try {
      setLoading(true);
      const response = await getLowStockProducts({
        page: pageToFetch,
        limit: pageSizeToFetch,
        search: currentSearch.trim(),
      });

      const items = Array.isArray(response.data) ? response.data : response.data?.products || [];
      setProducts(items);

      if (response.pagination) {
        setPaginationMeta(response.pagination);
      } else {
        setPaginationMeta({
          total: items.length,
          page: pageToFetch,
          limit: pageSizeToFetch,
          totalPages: Math.max(1, Math.ceil(items.length / pageSizeToFetch)),
        });
      }
    } catch (error) {
      toast.error(isNo ? "Kunne ikke laste lavt lagernivå" : "Failed to load low stock articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchLowStock(page, pageSize, search);
    }, 350);

    return () => clearTimeout(timeout);
  }, [page, pageSize, search]);

  const filteredProducts = products;

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title={isNo ? "Lavt lagernivå-varsler" : "Low Stock Alerts"}
          description={isNo ? "Identifiser artikler som har nådd eller falt under sin minimumsgrense." : "Identify articles that have reached or dropped below their minimum stock threshold."}
        />

        <SurfaceCard className="p-4 sm:p-5">
          <div className="relative">
            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={isNo ? "Søk etter artikkelnavn, SKU eller stil..." : "Search by article name, SKU, or style..."}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className={`${formControlClass} pl-11`}
            />
          </div>
        </SurfaceCard>

        <div className="grid gap-4 lg:hidden">
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm animate-pulse">
              {isNo ? "Overvåker lagernivåer..." : "Monitoring stock levels..."}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              {search ? (isNo ? "Ingen treff funnet" : "No matches found") : (isNo ? "Alle lagernivåer er sunne." : "All stock levels are currently healthy.")}
            </div>
          )}

          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {product.productName}
                  </h3>
                  <p className="mt-1 truncate text-xs font-medium text-slate-500">
                    SKU: {product.sku}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <FiAlertTriangle size={20} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isNo ? "Nåværende beholdning" : "Current Stock"}</dt>
                  <dd className="mt-1 text-lg font-bold text-orange-600">{product.stockQuantity}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isNo ? "Varslingsgrense" : "Alert Limit"}</dt>
                  <dd className="mt-1 text-lg font-bold text-slate-700">{product.minStockAlert}</dd>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                  {product.category?.name || (isNo ? "Ukategorisert" : "Uncategorized")}
                </span>
                <Link
                  to={`/products/edit/${product.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <FiBox size={14} />
                  <span>{isNo ? "Oppdater lager" : "Restock Article"}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block p-4 sm:p-5 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">{isNo ? "Artikkel" : "Article"}</th>
                  <th className="px-6 py-4">{isNo ? "Kategori" : "Category"}</th>
                  <th className="px-6 py-4 text-center">{isNo ? "Nåværende lager" : "Current Stock"}</th>
                  <th className="px-6 py-4 text-center">{isNo ? "Varslingsgrense" : "Min Threshold"}</th>
                  <th className="px-6 py-4 text-center">{isNo ? "Status" : "Status"}</th>
                  <th className="px-6 py-4 text-right">{isNo ? "Handling" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-sm text-slate-500">
                      <span className="animate-pulse">{isNo ? "Laster lagerdata..." : "Loading stock data..."}</span>
                    </td>
                  </tr>
                )}
                {!loading && filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-sm text-slate-500">
                      {search ? (isNo ? "Ingen matchende artikler med lavt lager." : "No matching low stock articles.") : (isNo ? "Null lagervarsler. Alt er godt på lager." : "Zero stock alerts. Everything is properly stocked.")}
                    </td>
                  </tr>
                )}
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-slate-100 text-sm transition hover:bg-orange-50/30"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{product.productName}</div>
                      <div className="text-xs text-slate-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                        {product.category?.name || (isNo ? "Ukategorisert" : "Uncategorized")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-base font-bold text-orange-600">
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-700">
                      {product.minStockAlert}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold text-orange-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse"></span>
                        {isNo ? "Lavt lager" : "Low Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:bg-white hover:text-slate-900 hover:shadow-sm"
                        title={isNo ? "Rediger artikkel" : "Edit Article"}
                      >
                        <FiBox size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
            itemLabel="alerts"
            itemLabelNo="varsler"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default LowStockPage;
