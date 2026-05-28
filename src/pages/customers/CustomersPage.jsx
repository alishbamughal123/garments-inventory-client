import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

import MainLayout from "../../layouts/MainLayout";

import DeleteModal from "../../components/common/DeleteModal";

import {
  getCustomers,
  deleteCustomer,
} from "../../services/customers.service";

const CustomersPage = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedCustomerId, setSelectedCustomerId] =
    useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

 const fetchCustomers =
  async () => {
    try {
      const response =
        await getCustomers();

      console.log(response.data);

     setCustomers(
  response.data.data || []
);

    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to fetch customers"
      );
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (
    id
  ) => {
    setSelectedCustomerId(id);

    setShowDeleteModal(true);
  };

  const closeDeleteModal =
    () => {
      setSelectedCustomerId(null);

      setShowDeleteModal(false);
    };

  const handleDelete =
    async (id) => {
      try {
        await deleteCustomer(id);

        toast.success(
          "Customer deleted successfully"
        );

        fetchCustomers();

        closeDeleteModal();
      } catch (error) {
        toast.error(
          "Failed to delete customer"
        );
      }
    };

  const filteredCustomers =
    customers.filter(
      (customer) =>
        customer.fullName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        customer.phoneNumber
          ?.includes(search)
    );

  if (loading) {
    return (
      <MainLayout>
        Loading customers...
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
            Customers
          </h1>

          <button
            onClick={() =>
              navigate(
                "/customers/add"
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
              transition
            "
          >
            <FiPlus />

            Add Customer
          </button>
        </div>

        <div
          className="
            bg-white
            p-6
            rounded-2xl
            border
          "
        >
          <input
            type="text"
            placeholder="Search customer..."
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
              focus:ring-2
              focus:ring-blue-500
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

                <th
                  className="
                    text-left
                    p-5
                  "
                >
                  Name
                </th>

                <th
                  className="
                    text-left
                    p-5
                  "
                >
                  Phone
                </th>

                <th
                  className="
                    text-left
                    p-5
                  "
                >
                  Type
                </th>

                <th
                  className="
                    text-left
                    p-5
                  "
                >
                  City
                </th>

                <th
                  className="
                    text-left
                    p-5
                  "
                >
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredCustomers.map(
                (customer) => (
                  <tr
                    key={customer.id}
                    className="
                      border-t
                    "
                  >

                    <td className="p-5">
                      {
                        customer.fullName
                      }
                    </td>

                    <td className="p-5">
                      {
                        customer.phoneNumber
                      }
                    </td>

                    <td className="p-5">
                      {
                        customer.customerType
                      }
                    </td>

                    <td className="p-5">
                      {
                        customer.city
                      }
                    </td>

                    <td className="p-5">

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <button
                          onClick={() =>
                            navigate(
                              `/customers/${customer.id}`
                            )
                          }
                          className="
                            w-10
                            h-10
                            rounded-xl
                            border
                            flex
                            items-center
                            justify-center
                            hover:bg-slate-100
                            transition
                          "
                        >
                          <FiEye size={18} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/customers/edit/${customer.id}`
                            )
                          }
                          className="
                            w-10
                            h-10
                            rounded-xl
                            border
                            border-blue-200
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-50
                            transition
                          "
                        >
                          <FiEdit size={18} />
                        </button>

                        <button
                          onClick={() =>
                            openDeleteModal(
                              customer.id
                            )
                          }
                          className="
                            w-10
                            h-10
                            rounded-xl
                            border
                            border-red-200
                            text-red-600
                            flex
                            items-center
                            justify-center
                            hover:bg-red-50
                            transition
                          "
                        >
                          <FiTrash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>
        </div>

        <DeleteModal
          isOpen={
            showDeleteModal
          }
          onClose={
            closeDeleteModal
          }
          onConfirm={() =>
            handleDelete(
              selectedCustomerId
            )
          }
          title="Delete Customer"
          message="Are you sure you want to delete this customer?"
        />

      </div>
    </MainLayout>
  );
};

export default CustomersPage;