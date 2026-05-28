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
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="text-left px-6 py-4">
                    Date
                  </th>

                  <th className="text-left px-6 py-4">
                    Product
                  </th>

                  <th className="text-left px-6 py-4">
                    Type
                  </th>

                  <th className="text-left px-6 py-4">
                    Quantity
                  </th>

                  <th className="text-left px-6 py-4">
                    Previous
                  </th>

                  <th className="text-left px-6 py-4">
                    New
                  </th>

                  <th className="text-left px-6 py-4">
                    User
                  </th>

                  <th className="text-left px-6 py-4">
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
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
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
        )}

      </div>

    </MainLayout>
  );
};

export default TransactionsPage;