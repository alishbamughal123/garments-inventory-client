import { useState } from "react";
import { Calculator, DollarSign, ArrowRight, Percent } from "lucide-react";
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
  const [articleImageFile, setArticleImageFile] = useState(null);
  const [washingImageFile, setWashingImageFile] = useState(null);
  const [articlePreview, setArticlePreview] = useState(initialData?.imageUrl || "");
  const [washingPreview, setWashingPreview] = useState(initialData?.washingInstructionsImageUrl || "");
  const [showUsdCalc, setShowUsdCalc] = useState(false);
  const [usdCalcPrice, setUsdCalcPrice] = useState("");
  const [usdCalcMarkup, setUsdCalcMarkup] = useState(20);
  const [usdCalcRate, setUsdCalcRate] = useState(10);

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
      weightInKg: Number(
        formData.weightInKg || 0
      ),
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
      articleImageFile,
      washingImageFile,
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
            Weight per Article (kg)
          </label>
          <input
            type="number"
            step="0.01"
            name="weightInKg"
            value={formData.weightInKg || ""}
            onChange={handleChange}
            placeholder="0.45 kg"
            className={`${formControlClass} border-indigo-200 focus:border-indigo-500 font-bold text-indigo-900`}
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
          <div className="flex items-center justify-between mb-1">
            <label className={formLabelClass}>
              Purchase / Cost Price (NOK)
            </label>
            <button
              type="button"
              onClick={() => setShowUsdCalc(!showUsdCalc)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
            >
              <Calculator className="w-3.5 h-3.5" />
              {showUsdCalc ? "Hide USD Helper" : "USD Invoice Helper"}
            </button>
          </div>
          <input
            type="number"
            step="0.01"
            name="purchasePrice"
            value={
              formData.purchasePrice
            }
            onChange={handleChange}
            required
            placeholder="e.g. 45.72"
            className={formControlClass}
          />

          {showUsdCalc && (
            <div className="mt-2.5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs space-y-2">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Calculate from USD Invoice</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-slate-600 block">USD Price ($)</span>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="3.81"
                    value={usdCalcPrice}
                    onChange={(e) => setUsdCalcPrice(e.target.value)}
                    className="w-full mt-0.5 rounded-lg border border-blue-200 bg-white px-2 py-1 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-600 block">Markup %</span>
                  <input
                    type="number"
                    step="1"
                    placeholder="20"
                    value={usdCalcMarkup}
                    onChange={(e) => setUsdCalcMarkup(e.target.value)}
                    className="w-full mt-0.5 rounded-lg border border-blue-200 bg-white px-2 py-1 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-600 block">1 USD = NOK</span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="10"
                    value={usdCalcRate}
                    onChange={(e) => setUsdCalcRate(e.target.value)}
                    className="w-full mt-0.5 rounded-lg border border-blue-200 bg-white px-2 py-1 text-xs font-mono font-bold"
                  />
                </div>
              </div>
              {(() => {
                const uPrice = parseFloat(usdCalcPrice) || 0;
                const uMarkup = parseFloat(usdCalcMarkup) || 0;
                const uRate = parseFloat(usdCalcRate) || 0;
                const calcNOK = Number((uPrice * (1 + uMarkup / 100) * uRate).toFixed(2));
                return (
                  <div className="flex items-center justify-between pt-1.5 border-t border-blue-100">
                    <span className="text-[11px] font-mono text-slate-700">
                      = <strong>NOK {calcNOK}</strong>
                    </span>
                    <button
                      type="button"
                      disabled={calcNOK <= 0}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, purchasePrice: calcNOK }));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold disabled:opacity-50 transition"
                    >
                      Apply NOK Price
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div>
          <label className={formLabelClass}>
            Sale Price (NOK)
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

      {/* Image Upload Pickers */}
      <div className="mt-6 p-5 bg-slate-50 border border-slate-200/80 rounded-2xl grid gap-6 md:grid-cols-2">
        {/* Article Photo Picker */}
        <div>
          <label className={`${formLabelClass} flex items-center justify-between`}>
            <span>Article Photo (Product Image)</span>
            <span className="text-[10px] text-teal-600 font-bold uppercase">PNG, JPG, WEBP, SVG</span>
          </label>

          <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 bg-white border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-4 transition cursor-pointer group">
            <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={articlePreview || (formData.imageUrl ? (formData.imageUrl.startsWith("http") ? formData.imageUrl : `http://localhost:8000${formData.imageUrl}`) : "http://localhost:8000/uploads/placeholders/default-article.svg")}
                alt="Article Preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "http://localhost:8000/uploads/placeholders/default-article.svg";
                }}
              />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <span className="text-xs font-bold text-slate-800 block">
                {articleImageFile ? articleImageFile.name : "Choose Article Photo"}
              </span>
              <span className="text-[11px] text-slate-400 block">Click to browse or replace photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setArticleImageFile(file);
                    setArticlePreview(URL.createObjectURL(file));
                  }
                }}
                className="mt-2 block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Washing Care Photo Picker */}
        <div>
          <label className={`${formLabelClass} flex items-center justify-between`}>
            <span>Washing Care Label Photo</span>
            <span className="text-[10px] text-blue-600 font-bold uppercase">Care Label / Symbols</span>
          </label>

          <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 transition cursor-pointer group">
            <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={washingPreview || (formData.washingInstructionsImageUrl ? (formData.washingInstructionsImageUrl.startsWith("http") ? formData.washingInstructionsImageUrl : `http://localhost:8000${formData.washingInstructionsImageUrl}`) : "http://localhost:8000/uploads/placeholders/default-washing.svg")}
                alt="Washing Instructions Preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "http://localhost:8000/uploads/placeholders/default-washing.svg";
                }}
              />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <span className="text-xs font-bold text-slate-800 block">
                {washingImageFile ? washingImageFile.name : "Choose Care Label Photo"}
              </span>
              <span className="text-[11px] text-slate-400 block">Click to browse or replace care label</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setWashingImageFile(file);
                    setWashingPreview(URL.createObjectURL(file));
                  }
                }}
                className="mt-2 block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label className={formLabelClass}>
          Washing Care Text & Instructions
        </label>
        <input
          type="text"
          name="washingInstructions"
          value={formData.washingInstructions || ""}
          onChange={handleChange}
          placeholder="40°C Standard Wash. Do Not Bleach. Tumble Dry Low."
          className={formControlClass}
        />
      </div>

      <div className="mt-5">
        <label className={formLabelClass}>
          Description / Notes
        </label>
        <textarea
          rows="3"
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
