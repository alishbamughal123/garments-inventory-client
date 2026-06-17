import { useState } from "react";
import Button from "../ui/Button";
import {
  formControlClass,
  formLabelClass,
} from "../ui/formStyles";
import {
  buildStyleNumber,
  generateColorCode,
  sizeOptions,
} from "../../utils/articleVariant";

const ProductForm = ({
  categories,
  onSubmit,
  loading,
  initialData,
  submitLabel,
}) => {
  const [formData, setFormData] =
    useState(
      initialData || {
        categoryId: "",
        baseStyleNumber: "",
        styleNumber: "",
        styleName: "",
        itemName: "",
        productName: "",
        brand: "",
        color: "",
        colorCode: "",
        size: "",
        fabric: "",
        fabricComposition: "",
        fabricWeight: "",
        purchasePrice: "",
        salePrice: "",
        stockQuantity: "",
        minStockAlert: 5,
        description: "",
      }
    );

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "color") {
        next.colorCode =
          generateColorCode(value);
      }

      if (
        [
          "baseStyleNumber",
          "size",
          "colorCode",
          "color",
        ].includes(name)
      ) {
        next.styleNumber =
          buildStyleNumber({
            baseStyleNumber:
              next.baseStyleNumber,
            size: next.size,
            colorCode:
              next.colorCode ||
              generateColorCode(
                next.color
              ),
          });
      }

      if (
        name === "styleName" ||
        name === "itemName"
      ) {
        next.productName =
          next.productName ||
          [
            next.styleName,
            next.itemName,
          ]
            .filter(Boolean)
            .join(" ");
      }

      return next;
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
      className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className={formLabelClass}>
            Category
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className={formControlClass}
          >
            <option value="">
              Select Category
            </option>
            {categories?.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className={formLabelClass}>
            Base Style No
          </label>
          <input
            type="text"
            name="baseStyleNumber"
            value={
              formData.baseStyleNumber
            }
            onChange={handleChange}
            placeholder="10108"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Variant Style No
          </label>
          <input
            type="text"
            name="styleNumber"
            value={
              formData.styleNumber
            }
            onChange={handleChange}
            placeholder="10108-XXS-W"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Style Name
          </label>
          <input
            type="text"
            name="styleName"
            value={
              formData.styleName
            }
            onChange={handleChange}
            placeholder="Bergen"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Article / Item
          </label>
          <input
            type="text"
            name="itemName"
            value={
              formData.itemName
            }
            onChange={handleChange}
            placeholder="Trouser Unisex NS3357"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Display Name
          </label>
          <input
            type="text"
            name="productName"
            value={
              formData.productName
            }
            onChange={handleChange}
            placeholder="Bergen Trouser Unisex NS3357"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Colour
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            placeholder="White"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Colour Code
          </label>
          <input
            type="text"
            name="colorCode"
            value={
              formData.colorCode
            }
            onChange={handleChange}
            placeholder="W"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Size
          </label>
          <select
            name="size"
            value={formData.size}
            onChange={handleChange}
            className={formControlClass}
          >
            {sizeOptions.map(
              (size) => (
                <option
                  key={size || "blank"}
                  value={size}
                >
                  {size || "No size / one size"}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className={formLabelClass}>
            Fabric
          </label>
          <input
            type="text"
            name="fabric"
            value={formData.fabric}
            onChange={handleChange}
            placeholder="Cotton blend"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Fabric Composition
          </label>
          <input
            type="text"
            name="fabricComposition"
            value={
              formData.fabricComposition
            }
            onChange={handleChange}
            placeholder="65% Polyester, 35% Cotton"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Fabric Weight
          </label>
          <input
            type="text"
            name="fabricWeight"
            value={
              formData.fabricWeight
            }
            onChange={handleChange}
            placeholder="220gsm"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Nordic Prowear"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Purchase Price
          </label>
          <input
            type="number"
            name="purchasePrice"
            value={
              formData.purchasePrice
            }
            onChange={handleChange}
            required
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Sale Price
          </label>
          <input
            type="number"
            name="salePrice"
            value={
              formData.salePrice
            }
            onChange={handleChange}
            required
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            value={
              formData.stockQuantity
            }
            onChange={handleChange}
            required
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Min Stock Alert
          </label>
          <input
            type="number"
            name="minStockAlert"
            value={
              formData.minStockAlert
            }
            onChange={handleChange}
            required
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>
            Supplier / External Barcode
          </label>
          <input
            type="text"
            name="supplierBarcode"
            value={
              formData.supplierBarcode || ""
            }
            onChange={handleChange}
            placeholder="Scan manufacturer barcode..."
            className={`${formControlClass} border-blue-200 focus:border-blue-500`}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={formLabelClass}>
          Description / Notes
        </label>
        <textarea
          rows="4"
          name="description"
          value={
            formData.description
          }
          onChange={handleChange}
          className={formControlClass}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-6"
        size="lg"
      >
        {loading
          ? "Saving..."
          : submitLabel ||
            "Save Article"}
      </Button>
    </form>
  );
};

export default ProductForm;
