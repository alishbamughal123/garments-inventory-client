import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  UserRound,
} from "lucide-react";
import {
  addInteraction,
  getCustomerById,
  getInteractions,
} from "../../services/customer.service";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white";

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

  const loadInteractions =
    async () => {
      try {
        const response =
          await getInteractions(id);

        setInteractions(
          response.data
        );
      } catch {
        return null;
      }
    };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [
          customerResponse,
          interactionsResponse,
        ] = await Promise.all([
          getCustomerById(id),
          getInteractions(id),
        ]);

        if (!isMounted) {
          return;
        }

        setCustomer(
          customerResponse.data
        );
        setInteractions(
          interactionsResponse.data
        );
      } catch {
        toast.error(
          "Failed to load customer"
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
  }, [id]);

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
      } catch {
        toast.error(
          "Failed to add interaction"
        );
      }
    };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading customer...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Customer not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <UserRound size={24} />
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
              {customer.fullName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Customer Profile
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/crm/customers/edit/${customer.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              <Pencil size={16} />
              Edit
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Total Orders
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {customer.totalOrders}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Total Spending
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              Rs.{" "}
              {Number(
                customer.totalSpent || 0
              ).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Status
            </p>
            <div className="mt-2">
              <StatusBadge
                value={customer.status}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Contact Information
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Phone size={18} className="mt-0.5 text-slate-400" />
                <div className="min-w-0">
                  <p className="text-slate-400">
                    Phone
                  </p>
                  <p className="mt-1 font-medium">
                    {customer.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Mail size={18} className="mt-0.5 text-slate-400" />
                <div className="min-w-0">
                  <p className="text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 break-words font-medium">
                    {customer.email || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 sm:col-span-2">
                <MapPin size={18} className="mt-0.5 text-slate-400" />
                <div className="min-w-0">
                  <p className="text-slate-400">
                    Address
                  </p>
                  <p className="mt-1 font-medium">
                    {customer.address || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 sm:col-span-2">
                <Globe size={18} className="mt-0.5 text-slate-400" />
                <div className="min-w-0">
                  <p className="text-slate-400">
                    Website
                  </p>
                  <p className="mt-1 break-all font-medium">
                    {customer.website || "-"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Add Interaction
            </h3>

            <form
              onSubmit={
                handleAddInteraction
              }
              className="mt-5 grid gap-4"
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
                className={inputClass}
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
                className={inputClass}
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
                className={inputClass}
              />

              <Button
                type="submit"
                className="w-full sm:w-fit"
              >
                <Plus size={16} />
                Add Interaction
              </Button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Purchase History
            </h3>

            {customer.sales?.length ? (
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="py-3 pr-4 text-left font-medium">
                        Invoice
                      </th>
                      <th className="py-3 pr-4 text-left font-medium">
                        Amount
                      </th>
                      <th className="py-3 text-left font-medium">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.sales.map(
                      (sale) => (
                        <tr
                          key={sale.id}
                          className="border-t border-slate-100 text-slate-700"
                        >
                          <td className="py-3 pr-4">
                            {
                              sale.invoiceNumber
                            }
                          </td>
                          <td className="py-3 pr-4 font-medium text-slate-900">
                            Rs.
                            {
                              sale.grandTotal
                            }
                          </td>
                          <td className="py-3">
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
              <p className="mt-4 text-sm text-slate-500">
                No purchase history
              </p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Company Information
            </h3>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Building2 size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-slate-400">
                    Company
                  </p>
                  <p className="mt-1 font-medium">
                    {customer.companyName || "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="text-slate-400">
                  Designation
                </p>
                <p className="mt-1 font-medium">
                  {customer.designation || "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="text-slate-400">
                  Source
                </p>
                <p className="mt-1 font-medium">
                  {customer.source || "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="text-slate-400">
                  Customer Type
                </p>
                <p className="mt-1 font-medium">
                  {customer.customerType}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="text-slate-400">
                  City
                </p>
                <p className="mt-1 font-medium">
                  {customer.city || "-"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Activity Timeline
            </h3>

            <div className="mt-5 space-y-4">
              {interactions.length === 0 && (
                <p className="text-sm text-slate-500">
                  No interactions yet.
                </p>
              )}

              {interactions.map(
                (item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        value={item.type}
                        className="px-2.5"
                      />
                      <span className="text-xs text-slate-400">
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-3 font-medium text-slate-900">
                      {item.subject}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
