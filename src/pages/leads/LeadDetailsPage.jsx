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
  ShieldCheck,
  TrendingUp,
  Briefcase,
  Layers,
  Sparkles,
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
import { useLanguage } from "../../context/LanguageContext";

const LeadDetailsPage = () => {
  const { id } = useParams();
  const { t, isNo } = useLanguage();
  const [lead, setLead] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const loadLead = async () => {
    const response = await getLeadById(id);
    setLead(response.data);
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await getLeadById(id);
        if (isMounted) {
          setLead(response.data);
        }
      } catch {
        if (isMounted) {
          toast.error(isNo ? "Kunne ikke laste lead" : "Failed to load lead");
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleActivitySubmit = async (payload) => {
    try {
      setActivityLoading(true);
      await createActivity(payload);
      toast.success(isNo ? "Aktivitet loggført" : "Activity logged");
      await loadLead();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || (isNo ? "Kunne ikke loggføre aktivitet" : "Failed to log activity")
      );
    } finally {
      setActivityLoading(false);
    }
  };

  const handleEmailSubmit = async (payload) => {
    try {
      setEmailLoading(true);
      await sendEmail(payload);
      toast.success(isNo ? "E-post sendt" : "Email sent successfully");
      await loadLead();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || (isNo ? "Kunne ikke sende e-post" : "Failed to send email")
      );
    } finally {
      setEmailLoading(false);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "A+":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "A":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "A-":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "B+":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "B":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Tender":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (!lead) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        {isNo ? "Laster lead-detaljer..." : "Loading lead..."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {lead.rank && (
                <span className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                  #{lead.rank}
                </span>
              )}
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {lead.companyName || lead.fullName}
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-slate-500">
              {lead.legalEntity && lead.legalEntity !== lead.companyName && (
                <span className="font-medium text-slate-700">{lead.legalEntity} • </span>
              )}
              <span>{lead.segment || (isNo ? "Norsk B2B-virksomhet" : "Norwegian B2B Account")}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={appRoutes.crmLeadEdit(lead.id)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Pencil size={16} />
              {isNo ? "Rediger" : "Edit"}
            </Link>

            <Button
              onClick={async () => {
                try {
                  await convertLead(lead.id);
                  toast.success(isNo ? "Lead konvertert til kunde!" : "Lead converted successfully");
                  await loadLead();
                } catch {
                  toast.error(isNo ? "Konvertering feilet" : "Conversion failed");
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isNo ? "Konverter til kunde" : "Convert To Customer"}
            </Button>
          </div>
        </div>

        {/* 5-Metric Quick Stats Bar */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              {isNo ? "Pipeline-fase" : "Pipeline Status"}
            </p>
            <div className="mt-2">
              <StatusBadge value={lead.status} />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              {isNo ? "Prioritet" : "Priority"}
            </p>
            <div className="mt-2">
              {lead.priority ? (
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPriorityBadgeClass(
                    lead.priority
                  )}`}
                >
                  {lead.priority}
                </span>
              ) : (
                <span className="text-sm font-semibold text-slate-800">-</span>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              {isNo ? "Omsetning (MNOK)" : "Turnover (MNOK)"}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5 text-lg font-bold text-emerald-700">
              <TrendingUp size={18} />
              {lead.revenueMnok ? (
                <span>
                  {Number(lead.revenueMnok).toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}{" "}
                  MNOK
                </span>
              ) : (
                <span className="text-slate-400 text-sm">N/A</span>
              )}
            </div>
            {lead.financialYear && (
              <p className="text-xs text-slate-400 mt-0.5">{isNo ? "Regnskapsår:" : "Year:"} {lead.financialYear}</p>
            )}
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              {isNo ? "Sted / Fylke" : "Location / County"}
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-slate-900">
              {lead.city || lead.county || "Norge"}
            </p>
            {lead.county && lead.city && (
              <p className="text-xs text-slate-400 truncate">{lead.county}</p>
            )}
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              {isNo ? "Åpne oppgaver" : "Open Tasks"}
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {
                (lead.tasks || []).filter(
                  (task) => !["COMPLETED", "CANCELLED"].includes(task.status)
                ).length
              }
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          {/* Detailed Lead & Contact Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {isNo ? "Kontaktperson & Beslutningstaker" : "Contact Person & Decision Maker"}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <User size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">{isNo ? "Anbefalt kontakt" : "Contact Person"}</p>
                  <p className="mt-1 font-semibold text-slate-900">{lead.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Briefcase size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">{isNo ? "Stilling / Rolle" : "Role / Title"}</p>
                  <p className="mt-1 font-medium text-slate-900">{lead.designation || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Phone size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">{isNo ? "Telefon" : "Phone"}</p>
                  <p className="mt-1 font-semibold text-slate-900">{lead.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Mail size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">{isNo ? "E-post" : "Email"}</p>
                  <p className="mt-1 break-words font-medium text-slate-900">{lead.email || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <ShieldCheck size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">{isNo ? "Kontakttype" : "Contact Type"}</p>
                  <p className="mt-1 font-medium text-slate-900">{lead.contactType || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Sparkles size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">{isNo ? "Verifiseringsstatus" : "Verification Status"}</p>
                  <p className="mt-1 font-medium text-slate-900">{lead.verificationStatus || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 sm:col-span-2">
                <MapPin size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">{isNo ? "Sted / Fylke / Adresse" : "Location & Address"}</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {[lead.address, lead.city, lead.county].filter(Boolean).join(", ") || "-"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Garments, Staff & Operations Scope */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {isNo ? "Klesbehov, Avdelinger & Tekstiltjenester" : "Garment Requirements & Departments"}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isNo ? "Målgruppe / Ansatte / Avdelinger" : "Target Staff / Departments"}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {lead.relevantStaff || (isNo ? "Generelle arbeidsuniformer" : "Standard Workwear")}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isNo ? "Relevante tekstiler & tjenester" : "Relevant Textiles & Services"}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {lead.relevantTextiles || (isNo ? "Yrkesklær og tekstilleveranser" : "Workwear & Textile Deliveries")}
                </p>
              </div>

              {lead.healthcareNvk && (
                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {isNo ? "Helse & NVK-status" : "Healthcare & NVK Status"}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{lead.healthcareNvk}</p>
                </div>
              )}
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
