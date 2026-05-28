import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import CategoryForm from "../../components/categories/CategoryForm";

import {
  createCategory,
} from "../../services/category.service";

const AddCategoryPage = () => {
  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (data) => {
      try {
        setLoading(true);

        await createCategory(
          data
        );

        toast.success(
          "Category created successfully"
        );

        navigate(
          "/categories"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to create category"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>

      <div className="mb-6">

        <h1 className="
          text-3xl
          font-bold
          text-slate-900
        ">
          Add Category
        </h1>

        <p className="
          text-slate-500
          mt-1
        ">
          Create a new category
        </p>

      </div>

      <CategoryForm
        onSubmit={handleSubmit}
        loading={loading}
      />

    </MainLayout>
  );
};

export default AddCategoryPage;