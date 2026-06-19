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
  FiTrash2,
  FiEdit,
} from "react-icons/fi";

import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import DeleteModal from "../../components/common/DeleteModal";
import Loader from "../../components/ui/Loader";
import { formControlClass } from "../../components/ui/formStyles";
import {
  getSales,
  deleteSale,
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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await getSales();
      setSales(response.data || []);
    } catch {
      toast.error("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const openDeleteModal = (sale) => {
    setSelectedSale(sale);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSale) return;
    try {
      await deleteSale(selectedSale.id);
      toast.success("Sale deleted successfully");
      fetchSales();
      setDeleteModalOpen(false);
      setSelectedSale(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete sale");
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

  if (loading && sales.length === 0) {
    return (
      <MainLayout>
        <Loader message="Syncing invoice sales records..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="space-y-6">

        <PageHeader
          title="Sales"
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

                <div className="flex gap-2">
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
                  <button
                    onClick={() =>
                      navigate(
                        `/sales/edit/${sale.id}`
                      )
                    }
                    className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(sale)}
                    className="rounded-full border border-red-100 p-2 text-red-600 transition hover:bg-red-50"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
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

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
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
                  <th className="p-5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSales.map(
                  (sale) => (
                    <tr
                      key={sale.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="p-5 font-medium text-slate-900">
                        {
                          sale.invoiceNumber
                        }
                      </td>
                      <td className="p-5 text-slate-600">
                        {sale.customer
                          ?.fullName ||
                          "Walk-in Customer"}
                      </td>
                      <td className="p-5 font-bold text-slate-900">
                        Rs.{" "}
                        {
                          sale.grandTotal
                        }
                      </td>
                      <td className="p-5 text-slate-600">
                        {
                          sale.paymentMethod
                        }
                      </td>
                      <td className="p-5 text-slate-500">
                        {new Date(
                          sale.createdAt
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/sales/${sale.id}`
                              )
                            }
                            className="text-slate-400 transition hover:text-slate-900"
                            title="View Invoice"
                          >
                            <FiEye size={20} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/sales/edit/${sale.id}`
                              )
                            }
                            className="text-slate-400 transition hover:text-slate-900"
                            title="Edit Sale"
                          >
                            <FiEdit size={20} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(sale)}
                            className="text-slate-400 transition hover:text-red-600"
                            title="Delete Sale"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
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

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedSale(null);
        }}
        onConfirm={handleDelete}
        title="Delete Sale Transaction"
        message={`Are you sure you want to delete invoice ${selectedSale?.invoiceNumber}? This will automatically restore stock levels for all items in this sale.`}
      />

    </MainLayout>
  );
};

export default SalesPage;
