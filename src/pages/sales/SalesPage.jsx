
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
              className="w-full sm:w-auto"
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

        <div className="grid gap-4 lg:hidden">
          {filteredSales.map((sale) => (
            <article
              key={sale.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {sale.invoiceNumber}
                  </h3>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {sale.customer
                      ?.fullName ||
                      "Walk-in Customer"}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/sales/${sale.id}`
                    )
                  }
                  className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                >
                  <FiEye size={18} />
                </button>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-400">
                    Total
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    Rs. {sale.grandTotal}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">
                    Payment
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {
                      sale.paymentMethod
                    }
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-400">
                    Date
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {new Date(
                      sale.createdAt
                    ).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </article>
          ))}

          {filteredSales.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No sales found.
            </div>
          )}
        </div>

        <div className="hidden overflow-hidden rounded-2xl border bg-white lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-[840px] w-full">
              <thead className="bg-slate-100">
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
                      className="border-t"
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
                          className="text-slate-500 transition hover:text-[var(--color-primary-ink)]"
                        >
                          <FiEye size={22} />
                        </button>
                      </td>
                    </tr>
                  )
                )}

                {filteredSales.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-sm text-slate-500"
                    >
                      No sales found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </MainLayout>
  );
};

export default SalesPage;
