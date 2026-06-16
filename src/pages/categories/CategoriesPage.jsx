import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

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
    let isMounted = true;

    (async () => {
      try {
        const response =
          await getCategories();

        if (isMounted) {
          setCategories(
            response.data
          );
        }
      } catch {
        toast.error(
          "Failed to load categories"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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
        const response =
          await getCategories();
        setCategories(
          response.data
        );
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

      <PageHeader
        title="Categories"
        action={
          <Button
            onClick={() =>
              navigate(
                "/categories/add"
              )
            }
            size="lg"
          >
            <FiPlus />
            Add Category
          </Button>
        }
      />

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
