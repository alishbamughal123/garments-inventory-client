import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { FiPlus } from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import DeleteModal from "../../components/common/DeleteModal";
import SearchBar from "../../components/products/SearchBar";
import ProductTable from "../../components/products/ProductTable";
import Loader from "../../components/ui/Loader";
import {
  deleteProduct,
  getProducts,
  searchProducts,
} from "../../services/products.service";
import toast from "react-hot-toast";

const ProductsPage = () => {
  const navigate =
    useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");
  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        if (!search.trim()) {
          const response = await getProducts();
          setProducts(response.data || []);
          return;
        }

        const response = await searchProducts(search);
        setProducts(response.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const openDeleteModal = (
    product
  ) => {
    setSelectedProduct(
      product
    );
    setDeleteModalOpen(true);
  };

  const handleDelete =
    async () => {
      if (!selectedProduct) {
        return;
      }

      try {
        await deleteProduct(
          selectedProduct.id
        );

        setProducts((prev) =>
          prev.filter(
            (product) =>
              product.id !==
              selectedProduct.id
          )
        );

        toast.success(
          "Article deleted successfully"
        );
        setDeleteModalOpen(false);
        setSelectedProduct(null);
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to delete article"
        );
      }
    };

  return (
    <MainLayout>

      <div className="space-y-6">
        <PageHeader
          title="Articles"
          action={
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              <SearchBar
                search={search}
                setSearch={setSearch}
              />

              <Button
                onClick={() =>
                  navigate(
                    "/products/add"
                  )
                }
                size="lg"
                className="w-full sm:w-auto"
              >
                <FiPlus size={20} />
                Add Article
              </Button>
            </div>
          }
        />

      {loading ? (
        <Loader message="Loading apparel articles..." />
      ) : (
        <>
          <div className="flex items-center justify-between mb-2 px-1 sm:px-0">
            <p className="text-sm text-slate-500">
              Total Articles: <span className="font-semibold text-slate-900">{products.length}</span>
            </p>
          </div>

          <div className="bg-transparent sm:bg-white rounded-2xl border-0 sm:border border-slate-200 shadow-none sm:shadow-sm p-0 sm:p-6">
            <ProductTable
              products={products}
              onDelete={openDeleteModal}
            />
          </div>
        </>
      )}
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDelete}
        title="Delete Article"
        message={`Are you sure you want to delete ${
          selectedProduct?.styleNumber ||
          selectedProduct?.productName ||
          "this article"
        }? This action cannot be undone.`}
      />

    </MainLayout>
  );
};

export default ProductsPage;
