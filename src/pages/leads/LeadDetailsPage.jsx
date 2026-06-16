import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import {
  Building2,
  DollarSign,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
} from "lucide-react";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import { appRoutes } from "../../config/routes";
import toast from "react-hot-toast";
import {
  convertLead,
  getLeadById,
} from "../../services/lead.service";
import {
  createActivity,
} from "../../services/activity.service";
import {
  sendEmail,
} from "../../services/email.service";
import ActivityComposer from "../../components/crm/ActivityComposer";
import EmailComposer from "../../components/crm/EmailComposer";
import EmailConversationList from "../../components/crm/EmailConversationList";

const LeadDetailsPage = () => {
  const { id } = useParams();
  const [lead, setLead] =
    useState(null);
  const [
    activityLoading,
    setActivityLoading,
  ] = useState(false);
  const [
    emailLoading,
    setEmailLoading,
  ] = useState(false);

  const loadLead = async () => {
    const response =
      await getLeadById(id);

    setLead(
      response.data
    );
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response =
          await getLeadById(id);

        if (isMounted) {
          setLead(
            response.data
          );
        }
      } catch {
        if (isMounted) {
          toast.error(
            "Failed to load lead"
          );
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
        await loadLead();
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
        await loadLead();
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

  if (!lead) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading lead...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              {lead.fullName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {lead.companyName ||
                "No Company"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={appRoutes.crmLeadEdit(
                lead.id
              )}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Pencil size={16} />
              Edit
            </Link>

            <Button
              onClick={async () => {
                try {
                  await convertLead(
                    lead.id
                  );

                  toast.success(
                    "Lead converted successfully"
                  );
                  await loadLead();
                } catch {
                  toast.error(
                    "Conversion failed"
                  );
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Convert To Customer
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Status
            </p>
            <div className="mt-2">
              <StatusBadge
                value={lead.status}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Deal Value
            </p>
            <div className="mt-2 flex items-center gap-2 text-xl font-semibold text-emerald-700">
              <DollarSign size={18} />
              Rs.
              {Number(
                lead.expectedDealValue || 0
              ).toLocaleString()}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Source
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {lead.source}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              City
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {lead.city || "-"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Open Tasks
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {
                lead.tasks.filter(
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Lead Information
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <User size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-slate-400">
                    Full Name
                  </p>
                  <p className="mt-1 font-medium">
                    {lead.fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Building2 size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-slate-400">
                    Company
                  </p>
                  <p className="mt-1 font-medium">
                    {lead.companyName || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Phone size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-slate-400">
                    Phone
                  </p>
                  <p className="mt-1 font-medium">
                    {lead.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Mail size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 break-words font-medium">
                    {lead.email || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 sm:col-span-2">
                <MapPin size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 font-medium">
                    {lead.city || "-"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <ActivityComposer
            title="Log Lead Activity"
            entityIds={{
              leadId: lead.id,
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
              {lead.activityTimeline
                ?.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No activity recorded yet.
                </p>
              ) : (
                lead.activityTimeline.map(
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
              {lead.tasks.length ===
              0 ? (
                <p className="text-sm text-slate-500">
                  No tasks linked to this lead.
                </p>
              ) : (
                lead.tasks.map(
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
              Opportunity Snapshot
            </h3>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-400">
                  Lead source
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {lead.source}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-400">
                  Designation
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {lead.designation || "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-400">
                  Notes
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {lead.notes ||
                    "No notes available"}
                </p>
              </div>
            </div>
          </section>

          <EmailComposer
            title="Send Lead Email"
            entityIds={{
              leadId: lead.id,
            }}
            initialToEmail={
              lead.email || ""
            }
            onSubmit={
              handleEmailSubmit
            }
            loading={emailLoading}
          />

          <EmailConversationList
            conversations={
              lead.emailConversations ||
              []
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
