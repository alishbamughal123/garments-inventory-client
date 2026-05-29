
import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getCustomers,
  deleteCustomer,
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

  const fetchCustomers =
    async () => {
      try {
        setLoading(true);

        const response =
          await getCustomers(
            search,
            customerType,
            status
          );

        setCustomers(
          response.data
        );
      } catch (error) {
        toast.error(
          "Failed to load customers"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCustomers();
  }, [
    search,
    customerType,
    status,
  ]);

  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Delete customer?"
        );

      if (!confirmDelete)
        return;

      try {
        await deleteCustomer(id);

        toast.success(
          "Customer deleted"
        );

        fetchCustomers();
      } catch (error) {
        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <div className="p-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        {/* <div>
          <h1 className="text-2xl font-bold">
            Customers
          </h1>

          <p className="text-slate-500">
            CRM Contact Management
          </p>
        </div> */}

        <Link
          to="/crm/customers/create"
          className="
            inline-flex
            items-center
            gap-2
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          <FiPlus />
          Add Customer
        </Link>

      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            border
            rounded-lg
            px-4
            py-2
          "
        />

        <select
          value={customerType}
          onChange={(e) =>
            setCustomerType(
              e.target.value
            )
          }
          className="
            border
            rounded-lg
            px-4
            py-2
          "
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
          className="
            border
            rounded-lg
            px-4
            py-2
          "
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left p-4">
                  Customer
                </th>

                <th className="text-left p-4">
                  Company
                </th>

                <th className="text-left p-4">
                  Phone
                </th>

                <th className="text-left p-4">
                  Type
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-left p-4">
                  Orders
                </th>

                <th className="text-left p-4">
                  Spent
                </th>

                <th className="text-left p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {customers.map(
                (customer) => (
                  <tr
                    key={
                      customer.id
                    }
                    className="
                      border-b
                    "
                  >

                    <td className="p-4">
                      {
                        customer.fullName
                      }
                    </td>

                    <td className="p-4">
                      {
                        customer.companyName ||
                        "-"
                      }
                    </td>

                    <td className="p-4">
                      {
                        customer.phoneNumber
                      }
                    </td>

                    <td className="p-4">
                      {
                        customer.customerType
                      }
                    </td>

                    <td className="p-4">
                      {
                        customer.status
                      }
                    </td>

                    <td className="p-4">
                      {
                        customer.totalOrders
                      }
                    </td>

                    <td className="p-4">
                      Rs.
                      {
                        customer.totalSpent
                      }
                    </td>

                    <td className="p-4">

                      <div className="flex gap-3">

                        <Link
                          to={`/crm/customers/${customer.id}`}
                        >
                          <FiEye />
                        </Link>

                        <Link
                          to={`/crm/customers/edit/${customer.id}`}
                        >
                          <FiEdit />
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              customer.id
                            )
                          }
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {loading && (
        <p className="mt-4">
          Loading...
        </p>
      )}

    </div>
  );
};

export default CustomersPage;
