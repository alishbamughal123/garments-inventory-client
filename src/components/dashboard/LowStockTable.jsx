import { FiAlertTriangle } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

const LowStockTable = ({ products }) => {
  const { t, isNo } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <FiAlertTriangle className="text-amber-600" size={20} />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">
          {isNo ? "Varsler om lavt lager" : "Low Stock Alerts"}
        </h2>
      </div>

      {products?.length === 0 ? (
        <div className="bg-green-50 text-green-700 rounded-xl p-4 text-sm font-medium">
          {isNo ? "Alle artikler har tilstrekkelig lagerbeholdning." : "All products are sufficiently stocked."}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-slate-50 rounded-xl p-4"
            >
              <div>
                <h4 className="font-medium text-slate-800">
                  {product.productName}
                </h4>
                <p className="text-xs text-slate-500">
                  {isNo ? "Gjenbestilling anbefales" : "Reorder Recommended"}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold font-mono">
                {product.stockQuantity} {isNo ? "igjen" : "left"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockTable;