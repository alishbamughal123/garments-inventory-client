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
  UserRound,
} from "lucide-react";
import {
  getCustomerById,
} from "../../services/customer.service";
import {
  createActivity,
} from "../../services/activity.service";
import {
  sendEmail,
} from "../../services/email.service";
import StatusBadge from "../../components/ui/StatusBadge";
import ActivityComposer from "../../components/crm/ActivityComposer";
import EmailComposer from "../../components/crm/EmailComposer";
import EmailConversationList from "../../components/crm/EmailConversationList";
import { appRoutes } from "../../config/routes";

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] =
    useState(null);
  const [loading, setLoading] =
    useState(true);
  const [
    activityLoading,
    setActivityLoading,
  ] = useState(false);
  const [
    emailLoading,
    setEmailLoading,
  ] = useState(false);

  const loadCustomer = async () => {
    try {
      const response =
        await getCustomerById(id);

      setCustomer(
        response.data
      );
    } catch {
      toast.error(
        "Failed to load customer"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response =
          await getCustomerById(id);

        if (isMounted) {
          setCustomer(
            response.data
          );
        }
      } catch {
        if (isMounted) {
          toast.error(
            "Failed to load customer"
          );
        }
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

  const handleActivitySubmit =
    async (payload) => {
      try {
        setActivityLoading(
          true
        );
        await createActivity(
          payload
        );
        toast.success(
          "Activity logged"
        );
        await loadCustomer();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to log activity"
        );
      } finally {
        setActivityLoading(
          false
        );
      }
    };

  const handleEmailSubmit =
    async (payload) => {
      try {
        setEmailLoading(true);
        await sendEmail(payload);
        toast.success(
          "Email sent successfully"
        );
        await loadCustomer();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to send email"
        );
      } finally {
        setEmailLoading(false);
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
              Customer profile with unified activity and email history.
            </p>
          </div>

          <Link
            to={appRoutes.crmCustomerEdit(
              customer.id
            )}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            <Pencil size={16} />
            Edit
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Open Tasks
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {
                customer.tasks.filter(
                  (task) =>
                    ![
                      "COMPLETED",
                      "CANCELLED",
                    ].includes(
                      task.status
                    )
                ).length
              }
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
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

          <ActivityComposer
            title="Log Customer Activity"
            entityIds={{
              customerId:
                customer.id,
            }}
            onSubmit={
              handleActivitySubmit
            }
            loading={
              activityLoading
            }
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Unified Activity Timeline
            </h3>

            <div className="mt-5 space-y-4">
              {customer.activityTimeline
                ?.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No activity recorded yet.
                </p>
              ) : (
                customer.activityTimeline.map(
                  (item) => (
                    <div
                      key={`${item.source}-${item.id}`}
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
                        {item.description ||
                          "No details added"}
                      </p>

                      {item.createdBy
                        ?.name && (
                        <p className="mt-2 text-xs text-slate-400">
                          By{" "}
                          {
                            item
                              .createdBy
                              .name
                          }
                        </p>
                      )}
                    </div>
                  )
                )
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Related Tasks
            </h3>

            <div className="mt-5 space-y-3">
              {customer.tasks.length ===
              0 ? (
                <p className="text-sm text-slate-500">
                  No tasks linked to this customer.
                </p>
              ) : (
                customer.tasks.map(
                  (task) => (
                    <Link
                      key={task.id}
                      to={appRoutes.crmTaskDetails(
                        task.id
                      )}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-900">
                            {task.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Due{" "}
                            {new Date(
                              task.dueDate
                            ).toLocaleDateString()}{" "}
                            with{" "}
                            {task.assignedUser
                              ?.name ||
                              "Unassigned"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <StatusBadge
                            value={task.priority}
                          />
                          <StatusBadge
                            value={task.status}
                          />
                        </div>
                      </div>
                    </Link>
                  )
                )
              )}
            </div>
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
                  {
                    customer.customerType
                  }
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

          <EmailComposer
            title="Send Customer Email"
            entityIds={{
              customerId:
                customer.id,
            }}
            initialToEmail={
              customer.email || ""
            }
            onSubmit={
              handleEmailSubmit
            }
            loading={emailLoading}
          />

          <EmailConversationList
            conversations={
              customer.emailConversations ||
              []
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
