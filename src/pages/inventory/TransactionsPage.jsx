import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Pagination from "../../components/common/Pagination";
import { getTransactions } from "../../services/inventory.service";
import { useLanguage } from "../../context/LanguageContext";

const TransactionsPage = () => {
  const { t, isNo } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });

  const fetchTransactions = async (pageToFetch = page, pageSizeToFetch = pageSize) => {
    try {
      setLoading(true);
      const response = await getTransactions({
        page: pageToFetch,
        limit: pageSizeToFetch,
      });

      const items = Array.isArray(response.data) ? response.data : response.data?.transactions || [];
      setTransactions(items);

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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page, pageSize);
  }, [page, pageSize]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          {t("transactions")}
        </h1>

        <p className="text-slate-500 mt-1">
          {t("inventoryMovementHistory")}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-4 sm:p-5 space-y-4">
        {loading ? (
          <div className="p-6 text-xs text-slate-500 text-center">{t("loading")}</div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-slate-500 text-xs text-center">
            {isNo ? "Ingen lagertransaksjoner funnet" : "No transactions found"}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 lg:hidden">
              {transactions.map((item) => (
                <article
                  key={item.id}
                  className="border-b border-slate-200 pb-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 text-xs">
                        {item.product?.productName}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        item.transactionType === "STOCK_IN"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.transactionType}
                    </span>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-slate-400 font-semibold">{t("quantity")}</dt>
                      <dd className="mt-0.5 font-bold text-slate-800">{item.quantity}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 font-semibold">{t("user")}</dt>
                      <dd className="mt-0.5 font-medium text-slate-700">{item.performedBy?.name || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 font-semibold">{t("previous")}</dt>
                      <dd className="mt-0.5 font-medium text-slate-700">{item.previousStock}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 font-semibold">{t("new")}</dt>
                      <dd className="mt-0.5 font-medium text-slate-700">{item.newStock}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-slate-400 font-semibold">{t("notes")}</dt>
                      <dd className="mt-0.5 text-slate-700">{item.notes || "-"}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-[1080px] w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 text-left">{t("date")}</th>
                    <th className="px-6 py-3.5 text-left">{t("product")}</th>
                    <th className="px-6 py-3.5 text-left">{t("type")}</th>
                    <th className="px-6 py-3.5 text-left">{t("quantity")}</th>
                    <th className="px-6 py-3.5 text-left">{t("previous")}</th>
                    <th className="px-6 py-3.5 text-left">{t("new")}</th>
                    <th className="px-6 py-3.5 text-left">{t("user")}</th>
                    <th className="px-6 py-3.5 text-left">{t("notes")}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {transactions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-3.5 text-slate-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-slate-900">
                        {item.product?.productName}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            item.transactionType === "STOCK_IN"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.transactionType}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-slate-900">{item.quantity}</td>
                      <td className="px-6 py-3.5 text-slate-600">{item.previousStock}</td>
                      <td className="px-6 py-3.5 text-slate-600">{item.newStock}</td>
                      <td className="px-6 py-3.5 font-medium text-slate-800">
                        {item.performedBy?.name}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 max-w-xs truncate">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination */}
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
              itemLabel="movements"
              itemLabelNo="bevegelser"
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TransactionsPage;
