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
        Loading...
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
          description="Review style-number variants, composition, and inventory information for Nordic Prowear articles."
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

      <SurfaceCard className="p-8">

        <div className="
          grid
          grid-cols-2
          gap-6
        ">

          <Info
            label="Variant Style No"
            value={
              product.styleNumber ||
              product.sku
            }
          />

          <Info
            label="Base Style No"
            value={
              product.baseStyleNumber
            }
          />

          <Info
            label="Style Name"
            value={
              product.styleName
            }
          />

          <Info
            label="Article / Item"
            value={
              product.itemName
            }
          />

          <Info
            label="Product Name"
            value={
              product.productName
            }
          />

          <Info
            label="SKU"
            value={
              product.sku
            }
          />

          <Info
            label="Barcode"
            value={
              barcode?.barcodeValue
            }
          />

          <Info
            label="Category"
            value={
              product.category?.name
            }
          />

          <Info
            label="Brand"
            value={
              product.brand
            }
          />

          <Info
            label="Color"
            value={
              product.color
            }
          />

          <Info
            label="Colour Code"
            value={
              product.colorCode
            }
          />

          <Info
            label="Size"
            value={
              product.size
            }
          />

          <Info
            label="Fabric"
            value={
              product.fabric
            }
          />

          <Info
            label="Fabric Composition"
            value={
              product.fabricComposition
            }
          />

          <Info
            label="Fabric Weight"
            value={
              product.fabricWeight
            }
          />

          <Info
            label="Purchase Price"
            value={`Rs ${product.purchasePrice}`}
          />

          <Info
            label="Sale Price"
            value={`Rs ${product.salePrice}`}
          />

          <Info
            label="Stock"
            value={
              product.stockQuantity
            }
          />

          <Info
            label="Min Alert"
            value={
              product.minStockAlert
            }
          />

        </div>

        <div className="mt-8">

          <h3 className="
            font-semibold
            mb-2
          ">
            Description
          </h3>

          <p className="
            text-slate-600
          ">
            {
              product.description
            }
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
  <div>

    <p className="
      text-sm
      text-slate-500
      mb-1
    ">
      {label}
    </p>

    <p className="
      font-semibold
      text-slate-800
    ">
      {value || "-"}
    </p>

  </div>
);

export default ProductDetailsPage;
