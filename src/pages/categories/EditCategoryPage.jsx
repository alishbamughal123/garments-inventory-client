import {
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import CategoryForm from "../../components/categories/CategoryForm";

import {
  updateCategory,
} from "../../services/category.service";

const EditCategoryPage = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const category =
    location.state;

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (data) => {
      try {
        setLoading(true);

        await updateCategory(
          category.id,
          data
        );

        toast.success(
          "Category updated successfully"
        );

        navigate(
          "/categories"
        );
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

  return (
    <MainLayout>

      <div className="mb-6">

        <h1 className="
          text-3xl
          font-bold
        ">
          Edit Category
        </h1>

      </div>

      <CategoryForm
        initialData={{
          name:
            category?.name || "",
          description:
            category?.description ||
            "",
        }}
        onSubmit={
          handleSubmit
        }
        loading={loading}
      />

    </MainLayout>
  );
};

export default EditCategoryPage;