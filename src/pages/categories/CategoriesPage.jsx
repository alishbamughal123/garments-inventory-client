import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/products/SearchBar";
import Pagination from "../../components/common/Pagination";
import { FiPlus } from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import CategoryTable from "../../components/categories/CategoryTable";
import DeleteModal from "../../components/common/DeleteModal";
import Loader from "../../components/ui/Loader";
import { useLanguage } from "../../context/LanguageContext";
import { getCategories, deleteCategory } from "../../services/category.service";

const CategoriesPage = () => {
  const { t, isNo } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchCategories = async (pageToFetch = page, pageSizeToFetch = pageSize, currentSearch = search) => {
    try {
      setLoading(true);
      const response = await getCategories({
        page: pageToFetch,
        limit: pageSizeToFetch,
        search: currentSearch.trim(),
      });

      const items = Array.isArray(response.data) ? response.data : response.data?.categories || [];
      setCategories(items);

      if (response.pagination) {
        setPaginationMeta(response.pagination);
      } else {
        setPaginationMeta({
          total: items.length,
          page: pageToFetch,
          limit: pageSizeToFetch,
          totalPages: Math.max(1, Math.ceil(items.length / pageSizeToFetch)),
        });
      }
    } catch {
      toast.error(isNo ? "Kunne ikke laste kategorier" : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCategories(page, pageSize, search);
    }, 350);

    return () => clearTimeout(timeout);
  }, [page, pageSize, search]);

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(selectedId);
      toast.success(isNo ? "Kategori slettet" : "Category deleted successfully");
      setDeleteModal(false);
      fetchCategories(page, pageSize, search);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          (isNo ? "Sletting mislyktes" : "Delete failed")
      );
    }
  };

  const handleEdit = (category) => {
    navigate(`/categories/edit/${category.id}`, {
      state: category,
    });
  };

  return (
    <MainLayout>
      <PageHeader
        title={t("categories")}
        action={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              search={search}
              setSearch={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
            <Button
              onClick={() => navigate("/categories/add")}
              size="lg"
            >
              <FiPlus />
              {isNo ? "Legg til kategori" : "Add Category"}
            </Button>
          </div>
        }
      />

      {loading && categories.length === 0 ? (
        <Loader message={isNo ? "Synkroniserer kategorier..." : "Syncing apparel categories..."} />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 font-medium">
            {isNo ? "Totalt antall kategorier:" : "Total Categories:"} {paginationMeta.total}
          </p>
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
          />
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <Pagination
              currentPage={page}
              totalPages={paginationMeta.totalPages}
              totalItems={paginationMeta.total}
              pageSize={pageSize}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              itemLabel="categories"
              itemLabelNo="kategorier"
            />
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title={isNo ? "Slett kategori" : "Delete Category"}
        message={
          isNo
            ? "Er du sikker på at du vil slette denne kategorien? Dette kan ikke angres."
            : "Are you sure you want to delete this category? This action cannot be undone."
        }
      />
    </MainLayout>
  );
};

export default CategoriesPage;
