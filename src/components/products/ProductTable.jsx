import {
  FiEye,
  FiTrash2,
  FiTag,
  FiEdit2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { resolveProductImageUrl, getColorHex } from "../../utils/imageHelper";
import { useLanguage } from "../../context/LanguageContext";

const ProductTable = ({
  products,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { t, isNo } = useLanguage();

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-100">
        <div className="rounded-full bg-slate-50 p-4 text-slate-400 mb-4 border border-slate-100">
          <FiTag size={32} />
        </div>
        <h3 className="text-base font-semibold text-slate-800">
          {isNo ? "Ingen artikler funnet" : "No articles found"}
        </h3>
        <p className="mt-1 text-sm text-slate-500 max-w-xs">
          {isNo
            ? "Prøv å justere søket eller legg til en ny artikkel for å komme i gang."
            : "Try adjusting your search terms or add a new apparel article to get started."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile & Tablet Card Grid (1 column on mobile, 2 columns on tablet) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {products.map((product) => {
          const barcode = product.barcodes?.find((b) => b.isPrimary) || product.barcodes?.[0];
          const lowStock = product.stockQuantity <= product.minStockAlert;
          const baseStyle = product.baseStyleNumber || (product.styleNumber ? product.styleNumber.split("-")[0] : "");
          const imgUrl = resolveProductImageUrl(product.imageUrl, baseStyle, product.color);
          const unitCost = Number(product.purchasePrice) || 0;
          const stockQty = Number(product.stockQuantity) || 0;
          const totalCostVal = stockQty * unitCost;

          return (
            <article
              key={product.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Garment Image Thumbnail */}
                    <div
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden shadow-xs hover:border-blue-300 transition"
                    >
                      <img
                        src={imgUrl}
                        alt={product.productName}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/uploads/placeholders/default-article.svg";
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 font-mono">
                        {product.styleNumber || product.sku}
                      </p>
                      <h3
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="truncate text-sm sm:text-base font-semibold text-slate-900 mt-0.5 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {product.productName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: getColorHex(product.color) }}
                        />
                        <span className="text-xs text-slate-500 truncate">
                          {product.color} • {product.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${
                      lowStock
                        ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${lowStock ? "bg-amber-500" : "bg-emerald-500"}`} />
                    {lowStock ? t("Low Stock") : t("In Stock")}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-slate-50/50 p-3 text-xs border border-slate-100/50">
                  <div>
                    <dt className="text-slate-400 font-medium">SKU</dt>
                    <dd className="mt-0.5 break-all font-semibold text-slate-700 font-mono">{product.sku}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">{t("barcode")}</dt>
                    <dd className="mt-0.5 break-all font-semibold text-slate-700 font-mono">{barcode?.barcodeValue || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">{t("Stock")}</dt>
                    <dd className="mt-0.5 font-semibold text-slate-700 font-mono">{product.stockQuantity} stk</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">{isNo ? "Kostpris / stk" : "Cost / Unit"}</dt>
                    <dd className="mt-0.5 font-semibold text-blue-700 font-mono text-[13px]">
                      {stockQty > 0 && unitCost > 0 ? `NOK ${unitCost.toFixed(2)}` : "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">{isNo ? "Total Kostverdi" : "Total Cost"}</dt>
                    <dd className="mt-0.5 font-bold text-slate-900 font-mono text-[13px]">
                      {stockQty > 0 && unitCost > 0 ? `NOK ${totalCostVal.toFixed(2)}` : "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">{t("Price")}</dt>
                    <dd className="mt-0.5 font-bold text-slate-900 font-mono text-[13px]">NOK {product.salePrice}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                >
                  <FiEye size={14} className="text-slate-400" />
                  {t("view")}
                </button>
                <button
                  onClick={() => navigate(`/products/barcode/${product.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <FiTag size={14} className="text-blue-500" />
                  {t("barcode")}
                </button>
                <button
                  onClick={() => navigate(`/products/edit/${product.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <FiEdit2 size={14} className="text-amber-500" />
                  {t("edit")}
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50/30 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  <FiTrash2 size={14} className="text-red-500" />
                  {t("delete")}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block no-scrollbar">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75">
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("Garment")}
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("Style No")}
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("Article & Color")}
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                SKU
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("barcode")}
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("Stock")}
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isNo ? "Kostpris / stk" : "Cost / Unit"}
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isNo ? "Total Kostverdi" : "Total Cost"}
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("Price")}
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("status")}
              </th>
              <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const barcode = product.barcodes?.find((b) => b.isPrimary) || product.barcodes?.[0];
              const lowStock = product.stockQuantity <= product.minStockAlert;
              const baseStyle = product.baseStyleNumber || (product.styleNumber ? product.styleNumber.split("-")[0] : "");
              const imgUrl = resolveProductImageUrl(product.imageUrl, baseStyle, product.color);
              const unitCost = Number(product.purchasePrice) || 0;
              const stockQty = Number(product.stockQuantity) || 0;
              const totalCostVal = stockQty * unitCost;

              return (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-slate-50/50 group"
                >
                  {/* Garment Image Preview */}
                  <td className="px-4 py-3">
                    <div
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden shadow-xs hover:border-blue-400 transition"
                      title={isNo ? "Klikk for å se farger og detaljer" : "Click to view garment colors & details"}
                    >
                      <img
                        src={imgUrl}
                        alt={product.productName}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/uploads/placeholders/default-article.svg";
                        }}
                      />
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-slate-900 font-mono">
                    {product.styleNumber || product.sku}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {product.productName}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400 flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: getColorHex(product.color) }}
                      />
                      <span>
                        {product.color} • {isNo ? `Str. ${product.size}` : `Size ${product.size}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500 font-mono">
                    {product.sku}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500 font-mono">
                    {barcode?.barcodeValue || "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 font-mono">
                    {product.stockQuantity}
                  </td>
                  <td className="px-4 py-4 text-sm font-mono">
                    {stockQty > 0 && unitCost > 0 ? (
                      <span className="font-semibold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100">
                        NOK {unitCost.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm font-mono">
                    {stockQty > 0 && unitCost > 0 ? (
                      <div className="font-semibold text-slate-900">
                        NOK {totalCostVal.toLocaleString("no-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-900 font-semibold font-mono">
                    NOK {product.salePrice}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        lowStock
                          ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${lowStock ? "bg-amber-500" : "bg-emerald-500"}`} />
                      {lowStock ? t("Low Stock") : t("In Stock")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                        title={isNo ? "Vis artikkel og farger" : "View Article & Color Options"}
                      >
                        <FiEye size={17} />
                      </button>
                      <button
                        onClick={() => navigate(`/products/barcode/${product.id}`)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        title={isNo ? "Artikkelstrekkode" : "Article Barcode"}
                      >
                        <FiTag size={17} />
                      </button>
                      <button
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
                        title={isNo ? "Rediger artikkel" : "Edit Article"}
                      >
                        <FiEdit2 size={17} />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title={isNo ? "Slett artikkel" : "Delete Article"}
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductTable;
