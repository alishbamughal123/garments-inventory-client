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
  Trash2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { appRoutes } from "../../config/routes";
import toast from "react-hot-toast";
import {
  deleteLead,
  getLeads,
} from "../../services/lead.service";

const LeadsPage = () => {
  const [leads, setLeads] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  async function fetchLeads() {
      try {
        setLoading(true);

        const response =
          await getLeads();

        setLeads(
          response.data || []
        );
      } catch {
        toast.error(
          "Failed to load leads"
        );
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete =
    async (id) => {
      if (
        !window.confirm(
          "Delete Lead?"
        )
      )
        return;

      try {
        await deleteLead(id);
        toast.success(
          "Lead deleted"
        );
        fetchLeads();
      } catch {
        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Manage opportunities, track status, and act on leads from any screen size."
        action={
          <Button
            as={Link}
            to={appRoutes.crmLeadsCreate}
          >
          <Plus size={16} />
          Add Lead
          </Button>
        }
      />

      <div className="grid gap-4 lg:hidden">
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading leads...
          </div>
        )}

        {!loading &&
          leads.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No leads found
            </div>
          )}

        {leads.map((lead) => (
          <article
            key={lead.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-900">
                  {lead.fullName}
                </h3>

                <p className="mt-1 truncate text-sm text-slate-500">
                  {lead.companyName ||
                    "No company"}
                </p>
              </div>

              <StatusBadge
                value={lead.status}
              />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-400">
                  Phone
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {lead.phoneNumber}
                </dd>
              </div>

              <div>
                <dt className="text-slate-400">
                  Value
                </dt>
                <dd className="mt-1 font-medium text-emerald-700">
                  Rs.
                  {Number(
                    lead.expectedDealValue || 0
                  ).toLocaleString()}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
                <Link
                to={appRoutes.crmLeadDetails(
                  lead.id
                )}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <Eye size={16} />
                View
              </Link>

              <Link
                to={appRoutes.crmLeadEdit(
                  lead.id
                )}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <Pencil size={16} />
                Edit
              </Link>

              <button
                onClick={() =>
                  handleDelete(
                    lead.id
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
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="p-4 text-left font-medium">
                  Name
                </th>
                <th className="p-4 text-left font-medium">
                  Company
                </th>
                <th className="p-4 text-left font-medium">
                  Phone
                </th>
                <th className="p-4 text-left font-medium">
                  Status
                </th>
                <th className="p-4 text-left font-medium">
                  Value
                </th>
                <th className="p-4 text-center font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-10 text-center text-sm text-slate-500"
                  >
                    Loading leads...
                  </td>
                </tr>
              )}

              {!loading &&
                leads.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-sm text-slate-500"
                    >
                      No leads found
                    </td>
                  </tr>
                )}

              {leads.map(
                (lead) => (
                  <tr
                    key={lead.id}
                    className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium text-slate-900">
                      {lead.fullName}
                    </td>

                    <td className="p-4">
                      {lead.companyName ||
                        "-"}
                    </td>

                    <td className="p-4">
                      {lead.phoneNumber}
                    </td>

                    <td className="p-4">
                      <StatusBadge
                        value={
                          lead.status
                        }
                      />
                    </td>

                    <td className="p-4 font-semibold text-emerald-700">
                      Rs.
                      {Number(
                        lead.expectedDealValue ||
                          0
                      ).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={appRoutes.crmLeadDetails(
                            lead.id
                          )}
                          className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                        >
                          <Eye size={16} />
                        </Link>

                        <Link
                          to={appRoutes.crmLeadEdit(
                            lead.id
                          )}
                          className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              lead.id
                            )
                          }
                          className="rounded-full border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2
                            size={16}
                          />
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
    </div>
  );
};

export default LeadsPage;
