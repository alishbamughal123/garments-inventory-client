import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { FiPlus } from "react-icons/fi";

import MainLayout from "../../layouts/MainLayout";

import SearchBar from "../../components/products/SearchBar";

import ProductTable from "../../components/products/ProductTable";

import {
  getProducts,
  searchProducts,
} from "../../services/products.service";

const ProductsPage = () => {
  const navigate =
    useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timeout =
      setTimeout(() => {
        handleSearch();
      }, 500);

    return () =>
      clearTimeout(timeout);
  }, [search]);

  const fetchProducts =
    async () => {
      try {
        const response =
          await getProducts();

        setProducts(
          response.data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleSearch =
    async () => {
      try {
        if (!search.trim()) {
          return fetchProducts();
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
    };

  return (
    <MainLayout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Products
        </h1>

        <div className="flex items-center gap-3">

          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          <button
            onClick={() =>
              navigate(
                "/products/add"
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
              transition-all
            "
          >
            <FiPlus size={18} />
            Add Product
          </button>

        </div>

      </div>

      {loading ? (
        <div className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-6
        ">
          Loading Products...
        </div>
      ) : (
        <>
          <p className="mb-4 text-slate-500">
            Total Products:{" "}
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
            />
          </div>
        </>
      )}

    </MainLayout>
  );
};

export default ProductsPage;