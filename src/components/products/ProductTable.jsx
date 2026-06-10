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
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>
          <tr className="border-b">
            <th className="text-left p-3">
              Style No
            </th>

            <th className="text-left p-3">
              Article
            </th>

            <th className="text-left p-3">
              SKU
            </th>

            <th className="text-left p-3">
              Barcode
            </th>

            <th className="text-left p-3">
              Stock
            </th>

            <th className="text-left p-3">
              Price
            </th>

            <th className="text-left p-3">
              Status
            </th>

            <th className="text-left p-3">
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
                className="
                  border-b
                  hover:bg-slate-50
                  transition
                "
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
                    <span
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-amber-50
                        text-amber-600
                        text-sm
                        font-medium
                      "
                    >
                      Low Stock
                    </span>
                  ) : (
                    <span
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-emerald-50
                        text-emerald-600
                        text-sm
                        font-medium
                      "
                    >
                      In Stock
                    </span>
                  )}

                </td>

                <td className="p-3">

                  <div className="
                    flex
                    items-center
                    gap-2
                  ">

                    {/* VIEW */}

                    <button
                      onClick={() =>
                        navigate(
                          `/products/${product.id}`
                        )
                      }
                      className="
                        p-2
                        rounded-lg
                        text-slate-500
                        hover:bg-[var(--color-primary-soft)]
                        hover:text-[var(--color-primary-ink)]
                        transition
                      "
                      title="View Article"
                    >
                      <FiEye size={18} />
                    </button>

                    {/* BARCODE */}

                    <button
                      onClick={() =>
                        navigate(
                          `/products/barcode/${product.id}`
                        )
                      }
                      className="
                        p-2
                        rounded-lg
                        text-slate-500
                        hover:bg-emerald-50
                        hover:text-emerald-600
                        transition
                      "
                      title="Article Barcode"
                    >
                      <FiTag size={18} />
                    </button>

                    {/* EDIT */}

                    <button
                      onClick={() =>
                        navigate(
                          `/products/edit/${product.id}`
                        )
                      }
                      className="
                        p-2
                        rounded-lg
                        text-slate-500
                        hover:bg-amber-50
                        hover:text-amber-600
                        transition
                      "
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
                      className="
                        p-2
                        rounded-lg
                        text-slate-500
                        hover:bg-red-50
                        hover:text-red-600
                        transition
                      "
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
  );
};

export default ProductTable;
