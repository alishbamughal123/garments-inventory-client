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
    let isMounted = true;

    (async () => {
      try {
        const response =
          await getProducts();

        if (isMounted) {
          setProducts(
            response.data
          );
        }
      } catch (error) {
        console.log(error);
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

  useEffect(() => {
    const timeout =
      setTimeout(async () => {
        try {
          if (!search.trim()) {
            const response =
              await getProducts();
            setProducts(
              response.data
            );

            return;
          }

          const response =
            await searchProducts(
              search
            );

          setProducts(
            response.data
          );
        } catch (error) {
          console.log(error);
        }
      }, 500);

    return () =>
      clearTimeout(timeout);
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
        <div className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-6
        ">
          Loading Articles...
        </div>
      ) : (
        <>
          <p className="mb-4 text-slate-500">
            Total Articles:{" "}
            {products.length}
          </p>

          <div className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-6
          ">
            <ProductTable
              products={products}
              onDelete={
                openDeleteModal
              }
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
