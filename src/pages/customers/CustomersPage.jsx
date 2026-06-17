import {
  useEffect,
  useState,
} from "react";
import {
  Link,
} from "react-router-dom";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import SurfaceCard from "../../components/ui/SurfaceCard";
import DeleteModal from "../../components/common/DeleteModal";
import { appRoutes } from "../../config/routes";
import toast from "react-hot-toast";
import {
  deleteCustomer,
  getCustomers,
} from "../../services/customer.service";

const CustomersPage = () => {
  const [customers, setCustomers] =
    useState([]);
  const [loading, setLoading] =
    useState(false);
  const [search, setSearch] =
    useState("");
  const [
    customerType,
    setCustomerType,
  ] = useState("");
  const [status, setStatus] =
    useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  async function fetchCustomers(currentSearch = search) {
    try {
      setLoading(true);

      const response = await getCustomers(
        currentSearch,
        customerType,
        status
      );

      setCustomers(response.data || []);
    } catch {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCustomers();
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, customerType, status]);

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const handleDelete =
    async () => {
      if (!selectedCustomer) return;

      try {
        await deleteCustomer(selectedCustomer.id);
        toast.success(
          "Customer deleted"
        );
        fetchCustomers();
        setDeleteModalOpen(false);
        setSelectedCustomer(null);
      } catch {
        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        action={
          <Button
            as={Link}
            to={appRoutes.crmCustomersCreate}
          >
          <Plus size={16} />
          Add Customer
          </Button>
        }
      />

      <SurfaceCard className="p-4 sm:p-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search customer, phone, or company"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </label>

          <select
            value={customerType}
            onChange={(e) =>
              setCustomerType(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="">
              All Types
            </option>
            <option value="REGULAR">
              Regular
            </option>
            <option value="WHOLESALE">
              Wholesale
            </option>
            <option value="VIP">
              VIP
            </option>
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="">
              All Status
            </option>
            <option value="ACTIVE">
              Active
            </option>
            <option value="INACTIVE">
              Inactive
            </option>
          </select>
        </div>
      </SurfaceCard>

      <section className="space-y-4">
        <div className="grid gap-4 lg:hidden">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {customer.fullName}
                  </h3>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {customer.companyName ||
                      "No company"}
                  </p>
                </div>

                <StatusBadge
                  value={
                    customer.status
                  }
                />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-400">
                    Phone
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {
                      customer.phoneNumber
                    }
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400">
                    Type
                  </dt>
                  <dd className="mt-1">
                    <StatusBadge
                      value={
                        customer.customerType
                      }
                      className="px-2.5"
                    />
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400">
                    Orders
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {
                      customer.totalOrders
                    }
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400">
                    Spent
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    Rs.
                    {Number(
                      customer.totalSpent || 0
                    ).toLocaleString()}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to={appRoutes.crmCustomerDetails(
                    customer.id
                  )}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <Eye size={16} />
                  View
                </Link>

                <Link
                  to={appRoutes.crmCustomerEdit(
                    customer.id
                  )}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <Pencil size={16} />
                  Edit
                </Link>

                <button
                  onClick={() =>
                    openDeleteModal(
                      customer
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </article>
          ))}

          {!loading &&
            customers.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                No customers found.
              </div>
            )}
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 text-sm text-slate-500">
                <tr>
                  <th className="px-5 py-4 text-left font-medium">
                    Customer
                  </th>
                  <th className="px-5 py-4 text-left font-medium">
                    Company
                  </th>
                  <th className="px-5 py-4 text-left font-medium">
                    Phone
                  </th>
                  <th className="px-5 py-4 text-left font-medium">
                    Type
                  </th>
                  <th className="px-5 py-4 text-left font-medium">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left font-medium">
                    Orders
                  </th>
                  <th className="px-5 py-4 text-left font-medium">
                    Spent
                  </th>
                  <th className="px-5 py-4 text-left font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {customers.map(
                  (customer) => (
                    <tr
                      key={customer.id}
                      className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {
                          customer.fullName
                        }
                      </td>
                      <td className="px-5 py-4">
                        {customer.companyName ||
                          "-"}
                      </td>
                      <td className="px-5 py-4">
                        {
                          customer.phoneNumber
                        }
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          value={
                            customer.customerType
                          }
                          className="px-2.5"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          value={
                            customer.status
                          }
                          className="px-2.5"
                        />
                      </td>
                      <td className="px-5 py-4">
                        {
                          customer.totalOrders
                        }
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-900">
                        Rs.
                        {Number(
                          customer.totalSpent || 0
                        ).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={appRoutes.crmCustomerDetails(
                              customer.id
                            )}
                            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={appRoutes.crmCustomerEdit(
                              customer.id
                            )}
                            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() =>
                              openDeleteModal(
                                customer
                              )
                            }
                            className="rounded-full border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}

                {!loading &&
                  customers.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-5 py-10 text-center text-sm text-slate-500"
                      >
                        No customers found.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-slate-500">
            Loading customers...
          </p>
        )}
      </section>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedCustomer(null);
        }}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${selectedCustomer?.fullName}? This action cannot be undone.`}
      />
    </div>
  );
};

export default CustomersPage;
