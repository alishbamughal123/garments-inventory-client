import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import ProductForm from "../../components/products/productForm";

import {
  getCategories,
} from "../../services/category.service";

import {
  getProductById,
  updateProduct,
} from "../../services/products.service";

const EditProductPage = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [product, setProduct] =
    useState(null);

  const [categories, setCategories] =
    useState([]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [
          categoriesResponse,
          productResponse,
        ] = await Promise.all([
          getCategories(),
          getProductById(id),
        ]);

        if (!isMounted) {
          return;
        }

        setCategories(
          categoriesResponse.data
        );

        setProduct(
          productResponse.data
        );
      } catch {
        toast.error(
          "Failed to load product"
        );
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (
    data
  ) => {
    try {
      setLoading(true);

      await updateProduct(
        id,
        data
      );

      toast.success(
        "Product updated successfully"
      );

      navigate("/products");
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <MainLayout>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          Loading product...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <PageHeader
        title="Edit Article"
        description="Update article attributes, style-number variants, and inventory metadata."
      />

      <ProductForm
        key={product.id}
        categories={categories}
        loading={loading}
        initialData={{
          categoryId:
            product.categoryId,

          productName:
            product.productName,

          baseStyleNumber:
            product.baseStyleNumber ||
            "",

          styleNumber:
            product.styleNumber || "",

          styleName:
            product.styleName || "",

          itemName:
            product.itemName || "",

          brand:
            product.brand || "",

          color:
            product.color || "",

          colorCode:
            product.colorCode || "",

          size:
            product.size || "",

          fabric:
            product.fabric || "",

          fabricComposition:
            product.fabricComposition ||
            "",

          fabricWeight:
            product.fabricWeight ||
            "",

          purchasePrice:
            product.purchasePrice,

          salePrice:
            product.salePrice,

          stockQuantity:
            product.stockQuantity,

          minStockAlert:
            product.minStockAlert,

          description:
            product.description || "",

          supplierBarcode:
            product.barcodes?.find(
              (b) =>
                b.barcodeSource ===
                "SUPPLIER"
            )?.barcodeValue || "",
        }}
        onSubmit={handleSubmit}
        submitLabel="Update Article"
      />

    </MainLayout>
  );
};

export default EditProductPage;
