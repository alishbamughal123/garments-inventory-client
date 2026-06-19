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
import SearchBar from "../../components/products/SearchBar";

import {
  FiPlus,
} from "react-icons/fi";

import MainLayout from "../../layouts/MainLayout";

import CategoryTable from "../../components/categories/CategoryTable";
import DeleteModal from "../../components/common/DeleteModal";
import Loader from "../../components/ui/Loader";

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

  const [search, setSearch] =
    useState("");

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

  const fetchCategories = async (currentSearch = search) => {
    try {
      const response = await getCategories(currentSearch);
      setCategories(response.data || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCategories();
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

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

      <PageHeader
        title="Categories"
        action={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              search={search}
              setSearch={setSearch}
            />
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
          </div>
        }
      />

      {loading ? (
        <Loader message="Syncing apparel categories..." />
      ) : (
        <div className="space-y-4">
           <p className="text-sm text-slate-500">
            Total Categories: {categories.length}
          </p>
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={
              openDeleteModal
            }
          />
        </div>
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
