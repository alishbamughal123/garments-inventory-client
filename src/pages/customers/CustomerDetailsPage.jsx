
import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  FiEdit,
  FiPhone,
  FiMail,
  FiMapPin,
  FiGlobe,
  FiPlus,
} from "react-icons/fi";

import {
  getCustomerById,
  getInteractions,
  addInteraction,
} from "../../services/customer.service";

const CustomerDetailsPage = () => {
  const { id } = useParams();

  const [customer, setCustomer] =
    useState(null);

  const [
    interactions,
    setInteractions,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [interactionForm,
    setInteractionForm] =
    useState({
      type: "NOTE",
      subject: "",
      description: "",
    });

  useEffect(() => {
    loadCustomer();
    loadInteractions();
  }, [id]);

  const loadCustomer =
    async () => {
      try {
        const response =
          await getCustomerById(id);

        setCustomer(
          response.data
        );
      } catch (error) {
        toast.error(
          "Failed to load customer"
        );
      } finally {
        setLoading(false);
      }
    };

  const loadInteractions =
    async () => {
      try {
        const response =
          await getInteractions(id);

        setInteractions(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleAddInteraction =
    async (e) => {
      e.preventDefault();

      try {
        await addInteraction(
          id,
          interactionForm
        );

        toast.success(
          "Interaction added"
        );

        setInteractionForm({
          type: "NOTE",
          subject: "",
          description: "",
        });

        loadInteractions();
      } catch (error) {
        toast.error(
          "Failed to add interaction"
        );
      }
    };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        Customer not found
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            {customer.fullName}
          </h1>

          <p className="text-slate-500">
            Customer Profile
          </p>

        </div>

        <Link
          to={`/customers/edit/${customer.id}`}
          className="
            flex
            items-center
            gap-2
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          <FiEdit />
          Edit
        </Link>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-slate-500">
            Total Orders
          </h3>

          <p className="text-3xl font-bold">
            {customer.totalOrders}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-slate-500">
            Total Spending
          </h3>

          <p className="text-3xl font-bold">
            Rs. {customer.totalSpent}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-slate-500">
            Status
          </h3>

          <p className="text-xl font-semibold">
            {customer.status}
          </p>
        </div>

      </div>

      {/* Profile */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Contact Information
          </h2>

          <div className="space-y-3">

            <div className="flex gap-3 items-center">
              <FiPhone />
              {customer.phoneNumber}
            </div>

            <div className="flex gap-3 items-center">
              <FiMail />
              {customer.email || "-"}
            </div>

            <div className="flex gap-3 items-center">
              <FiMapPin />
              {customer.address || "-"}
            </div>

            <div className="flex gap-3 items-center">
              <FiGlobe />
              {customer.website || "-"}
            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Company Information
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Company:</strong>{" "}
              {customer.companyName || "-"}
            </p>

            <p>
              <strong>Designation:</strong>{" "}
              {customer.designation || "-"}
            </p>

            <p>
              <strong>Source:</strong>{" "}
              {customer.source || "-"}
            </p>

            <p>
              <strong>Customer Type:</strong>{" "}
              {customer.customerType}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {customer.city || "-"}
            </p>

          </div>

        </div>

      </div>

      {/* Add Interaction */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h2 className="font-semibold text-lg mb-4">
          Add Interaction
        </h2>

        <form
          onSubmit={
            handleAddInteraction
          }
          className="grid gap-4"
        >

          <select
            value={
              interactionForm.type
            }
            onChange={(e) =>
              setInteractionForm({
                ...interactionForm,
                type:
                  e.target.value,
              })
            }
            className="border rounded-lg px-4 py-3"
          >
            <option value="CALL">
              Call
            </option>

            <option value="MEETING">
              Meeting
            </option>

            <option value="NOTE">
              Note
            </option>

            <option value="FOLLOW_UP">
              Follow Up
            </option>
          </select>

          <input
            placeholder="Subject"
            value={
              interactionForm.subject
            }
            onChange={(e) =>
              setInteractionForm({
                ...interactionForm,
                subject:
                  e.target.value,
              })
            }
            className="border rounded-lg px-4 py-3"
          />

          <textarea
            rows="4"
            placeholder="Description"
            value={
              interactionForm.description
            }
            onChange={(e) =>
              setInteractionForm({
                ...interactionForm,
                description:
                  e.target.value,
              })
            }
            className="border rounded-lg px-4 py-3"
          />

          <button
            type="submit"
            className="
              bg-blue-600
              text-white
              rounded-lg
              px-4
              py-3
              flex
              items-center
              gap-2
              w-fit
            "
          >
            <FiPlus />
            Add Interaction
          </button>

        </form>

      </div>

      {/* Timeline */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h2 className="font-semibold text-lg mb-6">
          Activity Timeline
        </h2>

        <div className="space-y-4">

          {interactions.map(
            (item) => (
              <div
                key={item.id}
                className="
                  border-l-4
                  border-blue-500
                  pl-4
                "
              >
                <div className="font-medium">
                  {item.type}
                </div>

                <div>
                  {item.subject}
                </div>

                <div className="text-sm text-slate-500">
                  {item.description}
                </div>

                <div className="text-xs text-slate-400 mt-1">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </div>
              </div>
            )
          )}

        </div>

      </div>

      {/* Purchase History */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h2 className="font-semibold text-lg mb-4">
          Purchase History
        </h2>

        {customer.sales?.length ? (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr>
                  <th className="text-left py-2">
                    Invoice
                  </th>

                  <th className="text-left py-2">
                    Amount
                  </th>

                  <th className="text-left py-2">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>

                {customer.sales.map(
                  (sale) => (
                    <tr
                      key={sale.id}
                    >
                      <td>
                        {
                          sale.invoiceNumber
                        }
                      </td>

                      <td>
                        Rs.
                        {
                          sale.grandTotal
                        }
                      </td>

                      <td>
                        {new Date(
                          sale.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        ) : (
          <p>
            No purchase history
          </p>
        )}

      </div>

    </div>
  );
};

export default CustomerDetailsPage;
