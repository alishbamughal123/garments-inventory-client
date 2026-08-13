import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import Loader from "../../components/ui/Loader";
import {
  getProductById,
  getPriceHistory,
} from "../../services/products.service";

const ProductDetailsPage = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [product, setProduct] =
    useState(null);

  const [priceHistory, setPriceHistory] =
    useState([]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [productRes, historyRes] = await Promise.all([
          getProductById(id),
          getPriceHistory(id).catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setProduct(productRes.data);
          setPriceHistory(historyRes?.data || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <Loader message="Loading article details..." />
      </MainLayout>
    );
  }

  const barcode =
    product?.barcodes?.find(
      (b) => b.isPrimary
    );

  return (
    <MainLayout>

      <div className="space-y-6">
        <PageHeader
          title="Article Details"
          description="Review style-number variants, composition, and inventory information for apparel articles."
          action={
            <Button
              onClick={() =>
                navigate(
                  `/products/edit/${product.id}`
                )
              }
              size="lg"
            >
              Edit Article
            </Button>
          }
        />

        <SurfaceCard className="p-5 sm:p-8">
          {/* Article & Washing Images Section */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
            {/* Article Photo */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Article Photo</span>
              <div className="w-full h-56 bg-white border border-slate-200 rounded-xl overflow-hidden p-2 flex items-center justify-center shadow-sm">
                <img
                  src={product.imageUrl ? (product.imageUrl.startsWith("http") ? product.imageUrl : `http://localhost:8000${product.imageUrl}`) : "http://localhost:8000/uploads/placeholders/default-article.svg"}
                  alt={product.productName}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "http://localhost:8000/uploads/placeholders/default-article.svg";
                  }}
                />
              </div>
            </div>

            {/* Washing Instructions Photo */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Washing Care Label & Instructions</span>
              <div className="w-full h-56 bg-white border border-slate-200 rounded-xl overflow-hidden p-2 flex items-center justify-center shadow-sm">
                <img
                  src={product.washingInstructionsImageUrl ? (product.washingInstructionsImageUrl.startsWith("http") ? product.washingInstructionsImageUrl : `http://localhost:8000${product.washingInstructionsImageUrl}`) : "http://localhost:8000/uploads/placeholders/default-washing.svg"}
                  alt="Washing Instructions"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "http://localhost:8000/uploads/placeholders/default-washing.svg";
                  }}
                />
              </div>
              <p className="mt-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-full text-center">
                <strong>Care Instructions:</strong> {product.washingInstructions || "40°C Standard Wash. Do Not Bleach. Tumble Dry Low."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <Info
              label="Variant Style No"
              value={product.styleNumber || product.sku}
            />

            <Info
              label="Base Style No"
              value={product.baseStyleNumber}
            />

            <Info
              label="Style Name"
              value={product.styleName}
            />

            <Info
              label="Article / Item"
              value={product.itemName}
            />

            <Info
              label="Product Name"
              value={product.productName}
            />

            <Info
              label="SKU"
              value={product.sku}
            />

            <Info
              label="Barcode"
              value={barcode?.barcodeValue}
            />

            <Info
              label="Category"
              value={product.category?.name}
            />

            <Info
              label="Brand"
              value={product.brand}
            />

            <Info
              label="Color"
              value={product.color}
            />

            <Info
              label="Colour Code"
              value={product.colorCode}
            />

            <Info
              label="Size"
              value={product.size}
            />

            <Info
              label="Fabric"
              value={product.fabric}
            />

            <Info
              label="Fabric Composition"
              value={product.fabricComposition}
            />

            <Info
              label="Fabric Weight"
              value={product.fabricWeight}
            />

            <Info
              label="Purchase Price"
              value={product.purchasePrice ? `Rs. ${product.purchasePrice}` : null}
            />

            <Info
              label="Sale Price"
              value={product.salePrice ? `Rs. ${product.salePrice}` : null}
            />

            <Info
              label="Stock"
              value={product.stockQuantity}
            />

            <Info
              label="Min Alert"
              value={product.minStockAlert}
            />
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">
              Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/40 rounded-xl border border-slate-100 p-4">
              {product.description || "No description provided for this article."}
            </p>
          </div>

          {/* PRICE HISTORY AUDIT LOG */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">
              Price Revision & Audit History
            </h3>
            {priceHistory.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50/40 rounded-xl border border-slate-100 p-4">
                No historical price changes recorded for this article.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Old Sale Price</th>
                      <th className="p-3">New Sale Price</th>
                      <th className="p-3">Old Cost</th>
                      <th className="p-3">New Cost</th>
                      <th className="p-3">Changed By</th>
                      <th className="p-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {priceHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-3 whitespace-nowrap text-slate-700 font-medium">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 whitespace-nowrap text-slate-500">
                          Rs. {Number(item.oldSalePrice).toFixed(2)}
                        </td>
                        <td className="p-3 whitespace-nowrap font-bold text-emerald-600">
                          Rs. {Number(item.newSalePrice).toFixed(2)}
                        </td>
                        <td className="p-3 whitespace-nowrap text-slate-500">
                          {item.oldPurchasePrice ? `Rs. ${Number(item.oldPurchasePrice).toFixed(2)}` : "-"}
                        </td>
                        <td className="p-3 whitespace-nowrap font-medium text-slate-700">
                          {item.newPurchasePrice ? `Rs. ${Number(item.newPurchasePrice).toFixed(2)}` : "-"}
                        </td>
                        <td className="p-3 whitespace-nowrap text-slate-600 font-medium">
                          {item.changedBy?.name || "System"}
                        </td>
                        <td className="p-3 text-slate-500">
                          {item.reason || "Price update"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </SurfaceCard>
      </div>

    </MainLayout>
  );
};

const Info = ({
  label,
  value,
}) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 transition-all duration-200 hover:bg-slate-50/80 hover:border-slate-200/60 hover:shadow-sm">
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-slate-800">
      {value || "-"}
    </p>
  </div>
);

export default ProductDetailsPage;
