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
  const navigate =
    useNavigate();

  return (
    <>
      <div className="grid gap-4 lg:hidden">
        {products.map((product) => {
          const barcode =
            product.barcodes?.find(
              (b) => b.isPrimary
            );
          const lowStock =
            product.stockQuantity <=
            product.minStockAlert;

          return (
            <article
              key={product.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                    {product.styleNumber ||
                      product.sku}
                  </p>
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {product.productName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {product.itemName ||
                      product.styleName ||
                      "-"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    lowStock
                      ? "bg-amber-50 text-amber-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {lowStock
                    ? "Low Stock"
                    : "In Stock"}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-400">
                    SKU
                  </dt>
                  <dd className="mt-1 break-all font-medium text-slate-700">
                    {product.sku}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">
                    Barcode
                  </dt>
                  <dd className="mt-1 break-all font-medium text-slate-700">
                    {barcode?.barcodeValue ||
                      "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">
                    Stock
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {product.stockQuantity}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">
                    Price
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    Rs.{product.salePrice}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    navigate(
                      `/products/${product.id}`
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <FiEye size={16} />
                  View
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `/products/barcode/${product.id}`
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700"
                >
                  <FiTag size={16} />
                  Barcode
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `/products/edit/${product.id}`
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700"
                >
                  <FiEdit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() =>
                    onDelete(product)
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                >
                  <FiTrash2 size={16} />
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-[960px] w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">
                Style No
              </th>
              <th className="p-3 text-left">
                Article
              </th>
              <th className="p-3 text-left">
                SKU
              </th>
              <th className="p-3 text-left">
                Barcode
              </th>
              <th className="p-3 text-left">
                Stock
              </th>
              <th className="p-3 text-left">
                Price
              </th>
              <th className="p-3 text-left">
                Status
              </th>
              <th className="p-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const barcode =
                product.barcodes?.find(
                  (b) => b.isPrimary
                );

              return (
                <tr
                  key={product.id}
                  className="border-b transition hover:bg-slate-50"
                >
                  <td className="p-3 font-medium">
                    {product.styleNumber ||
                      product.sku}
                  </td>
                  <td className="p-3 font-medium">
                    {product.productName}
                    <div className="mt-1 text-xs text-slate-500">
                      {product.itemName ||
                        product.styleName ||
                        "-"}
                    </div>
                  </td>
                  <td className="p-3">
                    {product.sku}
                  </td>
                  <td className="p-3">
                    {
                      barcode?.barcodeValue
                    }
                  </td>
                  <td className="p-3">
                    {
                      product.stockQuantity
                    }
                  </td>
                  <td className="p-3">
                    Rs.
                    {product.salePrice}
                  </td>
                  <td className="p-3">
                    {product.stockQuantity <=
                    product.minStockAlert ? (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600">
                        Low Stock
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/products/${product.id}`
                          )
                        }
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-ink)]"
                        title="View Article"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/products/barcode/${product.id}`
                          )
                        }
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                        title="Article Barcode"
                      >
                        <FiTag size={18} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/products/edit/${product.id}`
                          )
                        }
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                        title="Edit Article"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() =>
                          onDelete(
                            product
                          )
                        }
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete Article"
                      >
                        <FiTrash2 size={18} />
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
