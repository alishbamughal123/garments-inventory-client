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

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response =
          await getProductById(
            id
          );

        if (isMounted) {
          setProduct(
            response.data
          );
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
