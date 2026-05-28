import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import ProductForm from "../../components/products/ProductForm";

import {
  createProduct,
} from "../../services/products.service";

import {
  getCategories,
} from "../../services/category.service";

const AddProductPage = () => {
  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [categories, setCategories] =
    useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories =
    async () => {
      try {
        const response =
          await getCategories();

        setCategories(
          response.data
        );
      } catch {
        toast.error(
          "Failed to load categories"
        );
      }
    };

  const handleCreateProduct =
    async (data) => {
      try {
        setLoading(true);

        await createProduct(
          data
        );

        toast.success(
          "Product created successfully"
        );

        navigate("/products");
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to create product"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Add Product
        </h1>

        <p className="text-slate-500 mt-2">
          Create a new product
        </p>

      </div>

      <ProductForm
        categories={
          categories
        }
        onSubmit={
          handleCreateProduct
        }
        loading={loading}
      />

    </MainLayout>
  );
};

export default AddProductPage;