import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

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
    fetchProduct();
  }, []);

  const fetchProduct =
    async () => {
      try {
        const response =
          await getProductById(
            id
          );

        setProduct(
          response.data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

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

      <div className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        p-8
      ">

        <div className="
          flex
          justify-between
          items-center
          mb-8
        ">

          <h1 className="
            text-3xl
            font-bold
          ">
            Product Details
          </h1>

          <button
            onClick={() =>
              navigate(
                `/products/edit/${product.id}`
              )
            }
            className="
              px-5
              py-3
              bg-blue-500
              text-white
              rounded-xl
            "
          >
            Edit Product
          </button>

        </div>

        <div className="
          grid
          grid-cols-2
          gap-6
        ">

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