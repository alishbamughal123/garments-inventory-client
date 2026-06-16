import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiAlertTriangle, FiBox } from "react-icons/fi";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { getProducts } from "../../services/products.service";
import { formControlClass } from "../../components/ui/formStyles";
import api from "../../services/api";

const LowStockPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        setLoading(true);
        // Using the direct endpoint I verified earlier
        const response = await api.get("/products/low-stock");
        setProducts(response.data.data || []);
      } catch (error) {
        toast.error("Failed to load low stock articles");
      } finally {
        setLoading(false);
      }
    };
    fetchLowStock();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase()) ||
    p.styleNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Low Stock Alerts"
          description="Identify articles that have reached or dropped below their minimum stock threshold."
        />

        <SurfaceCard className="p-4 sm:p-5">
          <div className="relative">
  <FiSearch
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
  />
  <input
              type="text"
              placeholder="Search by article name, SKU, or style..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${formControlClass} pl-11`}
            />
          </div>
        </SurfaceCard>

        <div className="grid gap-4 lg:hidden">
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm animate-pulse">
              Monitoring stock levels...
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              {search ? "No matches found" : "All stock levels are currently healthy."}
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
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Stock</dt>
                  <dd className="mt-1 text-lg font-bold text-orange-600">{product.stockQuantity}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Threshold</dt>
                  <dd className="mt-1 text-lg font-bold text-slate-700">{product.minStockAlert}</dd>
                </div>
              </div>

              <Link
                to={`/products/edit/${product.id}`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800"
              >
                Update Stock
              </Link>
            </article>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Article</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-center">Current Stock</th>
                  <th className="px-6 py-4 text-center">Min Threshold</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-sm text-slate-500">
                      <span className="animate-pulse">Loading stock data...</span>
                    </td>
                  </tr>
                )}
                {!loading && filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-sm text-slate-500">
                      {search ? "No matching low stock articles." : "Zero stock alerts. Everything is properly stocked."}
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
                        {product.category?.name || "Uncategorized"}
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
                        Low Stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:bg-white hover:text-slate-900 hover:shadow-sm"
                      >
                        <FiBox size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LowStockPage;
