import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  getProductById,
} from "../../services/products.service";

const API_URL =
  import.meta.env.VITE_API_URL;

const BarcodePage = () => {
  const { id } =
    useParams();

  const [loading, setLoading] =
    useState(true);

  const [product, setProduct] =
    useState(null);

  const [barcode, setBarcode] =
    useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct =
    async () => {
      try {
        const response =
          await getProductById(id);

        const productData =
          response.data;

        setProduct(
          productData
        );

        const primaryBarcode =
          productData.barcodes?.find(
            (b) => b.isPrimary
          );

        setBarcode(
          primaryBarcode?.barcodeValue ||
            ""
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
        Loading Barcode...
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-8
          max-w-3xl
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          Product Barcode
        </h1>

        <div className="mb-6">
          <p className="text-slate-500">
            Product
          </p>

          <p className="font-semibold text-lg">
            {product.productName}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-slate-500">
            Barcode Value
          </p>

          <p className="font-mono text-lg">
            {barcode}
          </p>
        </div>

        <div
          className="
            border
            rounded-xl
            p-6
            inline-block
          "
        >
          <img
            src={`${API_URL}/products/barcode/${barcode}`}
            alt="Barcode"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={() =>
              window.print()
            }
            className="
              bg-blue-500
              hover:bg-blue-600
              text-white
              px-5
              py-3
              rounded-xl
            "
          >
            Print Barcode
          </button>
        </div>

      </div>

    </MainLayout>
  );
};

export default BarcodePage;