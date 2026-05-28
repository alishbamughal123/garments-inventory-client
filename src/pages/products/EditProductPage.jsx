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
import ProductForm from "../../components/products/ProductForm";

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
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [
        categoriesResponse,
        productResponse,
      ] = await Promise.all([
        getCategories(),
        getProductById(id),
      ]);

      setCategories(
        categoriesResponse.data
      );

      setProduct(
        productResponse.data
      );
    } catch (error) {
      toast.error(
        "Failed to load product"
      );
    } finally {
      setPageLoading(false);
    }
  };

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

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Edit Product
        </h1>

        <p className="text-slate-500 mt-1">
          Update product details
        </p>
      </div>

      <ProductForm
        categories={categories}
        loading={loading}
        buttonText="Update Product"
        initialData={{
          categoryId:
            product.categoryId,

          productName:
            product.productName,

          brand:
            product.brand || "",

          color:
            product.color || "",

          size:
            product.size || "",

          fabric:
            product.fabric || "",

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
        }}
        onSubmit={handleSubmit}
      />

    </MainLayout>
  );
};

export default EditProductPage;