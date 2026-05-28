
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiEye,
  FiPlus,
} from "react-icons/fi";

import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import {
  getSales,
} from "../../services/sales.service";

const SalesPage = () => {
  const navigate =
    useNavigate();

  const [sales, setSales] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales =
    async () => {
      try {
        const response =
          await getSales();

        setSales(
          response.data.data || []
        );
      } catch (error) {
        toast.error(
          "Failed to fetch sales"
        );
      } finally {
        setLoading(false);
      }
    };

  const filteredSales =
    sales.filter((sale) =>
      sale.invoiceNumber
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  if (loading) {
    return (
      <MainLayout>
        Loading sales...
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="space-y-6">

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Sales
          </h1>

          <button
            onClick={() =>
              navigate(
                "/sales/create"
              )
            }
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-3
              rounded-xl
              flex
              items-center
              gap-2
            "
          >
            <FiPlus />

            Create Sale
          </button>

        </div>

        <div
          className="
            bg-white
            border
            rounded-2xl
            p-5
          "
        >

          <input
            type="text"
            placeholder="Search invoice..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              outline-none
            "
          />

        </div>

        <div
          className="
            bg-white
            rounded-2xl
            border
            overflow-hidden
          "
        >

          <table className="w-full">

            <thead
              className="
                bg-slate-100
              "
            >

              <tr>

                <th className="p-5 text-left">
                  Invoice
                </th>

                <th className="p-5 text-left">
                  Customer
                </th>

                <th className="p-5 text-left">
                  Total
                </th>

                <th className="p-5 text-left">
                  Payment
                </th>

                <th className="p-5 text-left">
                  Date
                </th>

                <th className="p-5 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredSales.map(
                (sale) => (
                  <tr
                    key={sale.id}
                    className="
                      border-t
                    "
                  >

                    <td className="p-5">
                      {
                        sale.invoiceNumber
                      }
                    </td>

                    <td className="p-5">
                      {sale.customer
                        ?.fullName ||
                        "Walk-in Customer"}
                    </td>

                    <td className="p-5">
                      Rs.{" "}
                      {
                        sale.grandTotal
                      }
                    </td>

                    <td className="p-5">
                      {
                        sale.paymentMethod
                      }
                    </td>

                    <td className="p-5">
                      {new Date(
                        sale.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-5">

                      <button
                        onClick={() =>
                          navigate(
                            `/sales/${sale.id}`
                          )
                        }
                        className="
                          text-slate-500
                          hover:text-blue-600
                          transition
                        "
                      >
                        <FiEye size={22} />
                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </MainLayout>
  );
};

export default SalesPage;
