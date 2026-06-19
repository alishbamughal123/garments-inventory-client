import {
  FiEye,
  FiTrash2,
  FiTag,
  FiEdit2,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

const ProductTable = ({
  products,
  onDelete,
}) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-100">
        <div className="rounded-full bg-slate-50 p-4 text-slate-400 mb-4 border border-slate-100">
          <FiTag size={32} />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No articles found</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-xs">
          Try adjusting your search terms or add a new apparel article to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile & Tablet Card Grid (1 column on mobile, 2 columns on tablet) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {products.map((product) => {
          const barcode = product.barcodes?.find((b) => b.isPrimary);
          const lowStock = product.stockQuantity <= product.minStockAlert;

          return (
            <article
              key={product.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      {product.styleNumber || product.sku}
                    </p>
                    <h3
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="truncate text-base font-semibold text-slate-900 mt-0.5 hover:text-[var(--color-primary-ink)] transition-colors cursor-pointer"
                    >
                      {product.productName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {product.itemName || product.styleName || "-"}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${
                      lowStock
                        ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${lowStock ? "bg-amber-500" : "bg-emerald-500"}`} />
                    {lowStock ? "Low Stock" : "In Stock"}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-slate-50/50 p-3 text-xs border border-slate-100/50">
                  <div>
                    <dt className="text-slate-400 font-medium">SKU</dt>
                    <dd className="mt-0.5 break-all font-semibold text-slate-700 font-mono">{product.sku}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">Barcode</dt>
                    <dd className="mt-0.5 break-all font-semibold text-slate-700 font-mono">{barcode?.barcodeValue || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">Stock</dt>
                    <dd className="mt-0.5 font-semibold text-slate-700 font-mono">{product.stockQuantity}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">Price</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900 font-mono text-[13px]">Rs.{product.salePrice}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                >
                  <FiEye size={14} className="text-slate-400" />
                  View
                </button>
                <button
                  onClick={() => navigate(`/products/barcode/${product.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/30 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                >
                  <FiTag size={14} className="text-emerald-500" />
                  Barcode
                </button>
                <button
                  onClick={() => navigate(`/products/edit/${product.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/30 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-colors"
                >
                  <FiEdit2 size={14} className="text-amber-500" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50/30 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  <FiTrash2 size={14} className="text-red-500" />
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block no-scrollbar">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75">
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Style No
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Article
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                SKU
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Barcode
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Stock
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Price
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const barcode = product.barcodes?.find((b) => b.isPrimary);
              const lowStock = product.stockQuantity <= product.minStockAlert;

              return (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-slate-50/50 group"
                >
                  <td className="px-4 py-4 text-sm font-medium text-slate-900 font-mono">
                    {product.styleNumber || product.sku}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="font-semibold text-slate-800 group-hover:text-[var(--color-primary-ink)] transition-colors">
                      {product.productName}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {product.itemName || product.styleName || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500 font-mono">
                    {product.sku}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500 font-mono">
                    {barcode?.barcodeValue || "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 font-mono">
                    {product.stockQuantity}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-900 font-semibold font-mono">
                    Rs.{product.salePrice}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        lowStock
                          ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${lowStock ? "bg-amber-500" : "bg-emerald-500"}`} />
                      {lowStock ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-ink)]"
                        title="View Article"
                      >
                        <FiEye size={17} />
                      </button>
                      <button
                        onClick={() => navigate(`/products/barcode/${product.id}`)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                        title="Article Barcode"
                      >
                        <FiTag size={17} />
                      </button>
                      <button
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
                        title="Edit Article"
                      >
                        <FiEdit2 size={17} />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete Article"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductTable;
