import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../../layouts/MainLayout";

import {
  getTransactions,
} from "../../services/inventory.service";

const TransactionsPage = () => {
  const [
    transactions,
    setTransactions,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions =
    async () => {
      try {
        const response =
          await getTransactions();

        setTransactions(
          response.data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Transactions
        </h1>

        <p className="text-slate-500 mt-1">
          Inventory movement history
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

        {loading ? (
          <div className="p-6">
            Loading...
          </div>
        ) : transactions.length ===
          0 ? (
          <div className="p-6 text-slate-500">
            No transactions found
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 lg:hidden">
              {transactions.map(
                (item) => (
                  <article
                    key={item.id}
                    className="border-b border-slate-200 p-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900">
                          {
                            item.product
                              ?.productName
                          }
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(
                            item.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.transactionType ===
                          "STOCK_IN"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {
                          item.transactionType
                        }
                      </span>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-slate-400">
                          Quantity
                        </dt>
                        <dd className="mt-1 font-medium text-slate-700">
                          {item.quantity}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">
                          User
                        </dt>
                        <dd className="mt-1 font-medium text-slate-700">
                          {item
                            .performedBy
                            ?.name || "-"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">
                          Previous
                        </dt>
                        <dd className="mt-1 font-medium text-slate-700">
                          {
                            item.previousStock
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">
                          New
                        </dt>
                        <dd className="mt-1 font-medium text-slate-700">
                          {item.newStock}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-slate-400">
                          Notes
                        </dt>
                        <dd className="mt-1 text-slate-700">
                          {item.notes || "-"}
                        </dd>
                      </div>
                    </dl>
                  </article>
                )
              )}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-[1080px] w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left">
                      Previous
                    </th>
                    <th className="px-6 py-4 text-left">
                      New
                    </th>
                    <th className="px-6 py-4 text-left">
                      User
                    </th>
                    <th className="px-6 py-4 text-left">
                      Notes
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-200"
                      >
                        <td className="px-6 py-4">
                          {new Date(
                            item.createdAt
                          ).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {
                            item.product
                              ?.productName
                          }
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              item.transactionType ===
                              "STOCK_IN"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {
                              item.transactionType
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4">
                          {
                            item.previousStock
                          }
                        </td>
                        <td className="px-6 py-4">
                          {item.newStock}
                        </td>
                        <td className="px-6 py-4">
                          {
                            item
                              .performedBy
                              ?.name
                          }
                        </td>
                        <td className="px-6 py-4">
                          {item.notes}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </MainLayout>
  );
};

export default TransactionsPage;
