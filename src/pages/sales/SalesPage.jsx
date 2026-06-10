
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
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { formControlClass } from "../../components/ui/formStyles";
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
    let isMounted = true;

    (async () => {
      try {
        const response =
          await getSales();

        if (isMounted) {
          setSales(
            response.data || []
          );
        }
      } catch {
        toast.error(
          "Failed to fetch sales"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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

        <PageHeader
          title="Sales"
          description="Track completed sales with the same shared actions and input styling."
          action={
            <Button
            onClick={() =>
              navigate(
                "/sales/create"
              )
            }
            size="lg"
          >
            <FiPlus />
            Create Sale
            </Button>
          }
        />

        <SurfaceCard className="p-5">

          <input
            type="text"
            placeholder="Search invoice..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className={formControlClass}
          />
        </SurfaceCard>

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
                          hover:text-[var(--color-primary-ink)]
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
