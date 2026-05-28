import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  FiPlus,
} from "react-icons/fi";

import MainLayout from "../../layouts/MainLayout";

import CategoryTable from "../../components/categories/CategoryTable";

import DeleteModal from "../../components/common/DeleteModal";

import {
  getCategories,
  deleteCategory,
} from "../../services/category.service";

const CategoriesPage = () => {
  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [categories, setCategories] =
    useState([]);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

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
      } catch (error) {
        toast.error(
          "Failed to load categories"
        );
      } finally {
        setLoading(false);
      }
    };

  const openDeleteModal = (
    id
  ) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const handleDelete =
    async () => {
      try {
        await deleteCategory(
          selectedId
        );

        toast.success(
          "Category deleted successfully"
        );

        setDeleteModal(false);

        fetchCategories();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Delete failed"
        );
      }
    };

  const handleEdit =
    (category) => {
      navigate(
        `/categories/edit/${category.id}`,
        {
          state: category,
        }
      );
    };

  return (
    <MainLayout>

      <div
        className="
          flex
          justify-between
          items-center
          mb-6
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Categories
          </h1>

          <p
            className="
              text-slate-500
              mt-1
            "
          >
            Manage product categories
          </p>

        </div>

        <button
          onClick={() =>
            navigate(
              "/categories/add"
            )
          }
          className="
            flex
            items-center
            gap-2
            bg-blue-500
            hover:bg-blue-600
            text-white
            px-5
            py-3
            rounded-xl
            font-medium
            transition
          "
        >
          <FiPlus />
          Add Category
        </button>

      </div>

      {loading ? (
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-6
          "
        >
          Loading...
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={
            openDeleteModal
          }
        />
      )}

      <DeleteModal
        isOpen={deleteModal}
        onClose={() =>
          setDeleteModal(false)
        }
        onConfirm={
          handleDelete
        }
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />

    </MainLayout>
  );
};

export default CategoriesPage;