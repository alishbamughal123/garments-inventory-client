import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";

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
    let isMounted = true;

    (async () => {
      try {
        const response =
          await getProductById(id);

        const productData =
          response.data;

        if (!isMounted) {
          return;
        }

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
        Loading Barcode...
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Article Barcode"
          description="Preview and print the primary barcode for a Nordic Prowear article variant."
        />

        <SurfaceCard className="p-8">

        <div className="mb-6">
          <p className="text-slate-500">
            Article
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
          <Button
            onClick={() =>
              window.print()
            }
            size="lg"
          >
            Print Barcode
          </Button>
        </div>
        </SurfaceCard>
      </div>

    </MainLayout>
  );
};

export default BarcodePage;
