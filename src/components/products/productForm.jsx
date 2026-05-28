import { useState } from "react";

const ProductForm = ({
  categories,
  onSubmit,
  loading,
  initialData,
  buttonText,
}) => {
  const [formData, setFormData] =
    useState(
      initialData || {
        categoryId: "",
        productName: "",
        brand: "",
        color: "",
        size: "",
        fabric: "",
        purchasePrice: "",
        salePrice: "",
        stockQuantity: "",
        minStockAlert: 5,
        description: "",
      }
    );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,

      purchasePrice: Number(
        formData.purchasePrice
      ),

      salePrice: Number(
        formData.salePrice
      ),

      stockQuantity: Number(
        formData.stockQuantity
      ),

      minStockAlert: Number(
        formData.minStockAlert
      ),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-8
      "
    >
      <div className="grid md:grid-cols-2 gap-5">

        {/* CATEGORY */}

        <div>
          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Category
          </label>

          <select
            name="categoryId"
            value={
              formData.categoryId
            }
            onChange={
              handleChange
            }
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-200
            "
          >
            <option value="">
              Select Category
            </option>

            {categories?.map(
              (category) => (
                <option
                  key={
                    category.id
                  }
                  value={
                    category.id
                  }
                >
                  {category.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* PRODUCT NAME */}

        <div>
          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Product Name
          </label>

          <input
            type="text"
            name="productName"
            value={
              formData.productName
            }
            onChange={
              handleChange
            }
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-200
            "
          />
        </div>

        {/* BRAND */}

        <div>
          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Brand
          </label>

          <input
            type="text"
            name="brand"
            value={
              formData.brand
            }
            onChange={
              handleChange
            }
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
            "
          />
        </div>

        {/* COLOR */}

        <div>
          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Color
          </label>

          <input
            type="text"
            name="color"
            value={
              formData.color
            }
            onChange={
              handleChange
            }
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
            "
          />
        </div>

        {/* SIZE */}

        <div>
          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Size
          </label>

          <input
            type="text"
            name="size"
            value={
              formData.size
            }
            onChange={
              handleChange
            }
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
            "
          />
        </div>

        {/* FABRIC */}

        <div>
          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Fabric
          </label>

          <input
            type="text"
            name="fabric"
            value={
              formData.fabric
            }
            onChange={
              handleChange
            }
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
            "
          />
        </div>

        {/* PURCHASE PRICE */}

        <div>
          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Purchase Price
          </label>

          <input
            type="number"
            name="purchasePrice"
            value={
              formData.purchasePrice
            }
            onChange={
              handleChange
            }
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
            "
          />
        </div>

        {/* SALE PRICE */}

        <div>
          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Sale Price
          </label>

          <input
            type="number"
            name="salePrice"
            value={
              formData.salePrice
            }
            onChange={
              handleChange
            }
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
            "
          />
        </div>

        {/* STOCK */}

        <div>
          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Stock Quantity
          </label>

          <input
            type="number"
            name="stockQuantity"
            value={
              formData.stockQuantity
            }
            onChange={
              handleChange
            }
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
            "
          />
        </div>

        {/* MIN ALERT */}

        <div>
          <label className="
            block
            mb-2
            text-sm
            font-medium
          ">
            Min Stock Alert
          </label>

          <input
            type="number"
            name="minStockAlert"
            value={
              formData.minStockAlert
            }
            onChange={
              handleChange
            }
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              px-4
              py-3
            "
          />
        </div>

      </div>

      {/* DESCRIPTION */}

      <div className="mt-5">

        <label className="
          block
          mb-2
          text-sm
          font-medium
        ">
          Description
        </label>

        <textarea
          rows="4"
          name="description"
          value={
            formData.description
          }
          onChange={
            handleChange
          }
          className="
            w-full
            border
            border-slate-300
            rounded-xl
            px-4
            py-3
          "
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          mt-6
          bg-blue-500
          hover:bg-blue-600
          text-white
          px-6
          py-3
          rounded-xl
          font-medium
          transition
        "
      >
        {loading
          ? "Saving..."
          : buttonText ||
            "Save Product"}
      </button>

    </form>
  );
};

export default ProductForm;