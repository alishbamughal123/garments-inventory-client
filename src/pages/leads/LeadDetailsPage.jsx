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

const LeadDetailsPage = () => {
  const { id } = useParams();
  const [lead, setLead] =
    useState(null);

  async function loadLead() {
    try {
      const response =
        await getLeadById(id);

      setLead(
        response.data
      );
    } catch {
      toast.error(
        "Failed to load lead"
      );
    }
  }

  useEffect(() => {
    loadLead();
  }, [id]);

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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Notes
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {lead.notes ||
                "No notes available"}
            </p>
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
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
