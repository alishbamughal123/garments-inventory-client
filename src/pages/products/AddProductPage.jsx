import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import ProductForm from "../../components/products/productForm";
import { createProduct, uploadProductImages } from "../../services/products.service";
import { getCategories } from "../../services/category.service";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

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
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateProduct =
    async (data) => {
      try {
        setLoading(true);

        const { articleImageFile, washingImageFile, ...productData } = data;

        const createdRes = await createProduct(productData);
        const newProductId = createdRes.data?.id;

        if (newProductId && (articleImageFile || washingImageFile)) {
          const formData = new FormData();
          if (articleImageFile) formData.append("articleImage", articleImageFile);
          if (washingImageFile) formData.append("washingImage", washingImageFile);
          if (data.washingInstructions) formData.append("washingInstructions", data.washingInstructions);

          await uploadProductImages(newProductId, formData);
        }

        toast.success(
          "Product & images saved successfully"
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

      <PageHeader
        title="Add Article"
        description="Create a Nordic Prowear inventory article with dynamic style-number variants."
      />

      <ProductForm
        categories={
          categories
        }
        onSubmit={
          handleCreateProduct
        }
        loading={loading}
        submitLabel="Save Article"
      />

    </MainLayout>
  );
};

export default AddProductPage;
