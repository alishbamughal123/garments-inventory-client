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
  Search,
} from "lucide-react";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import DeleteModal from "../../components/common/DeleteModal";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { appRoutes } from "../../config/routes";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import { useLanguage } from "../../context/LanguageContext";
import Pagination from "../../components/common/Pagination";
import {
  deleteLead,
  getLeads,
} from "../../services/lead.service";

const LeadsPage = () => {
  const { t, isNo } = useLanguage();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  async function fetchLeads(pageToFetch = page, pageSizeToFetch = pageSize, currentSearch = search) {
    try {
      setLoading(true);

      const response = await getLeads({
        page: pageToFetch,
        limit: pageSizeToFetch,
        search: currentSearch.trim(),
      });

      const items = Array.isArray(response.data) ? response.data : response.data?.leads || [];
      setLeads(items);

      if (response.pagination) {
        setPaginationMeta(response.pagination);
      } else {
        setPaginationMeta({
          total: items.length,
          page: pageToFetch,
          limit: pageSizeToFetch,
          totalPages: Math.max(1, Math.ceil(items.length / pageSizeToFetch)),
        });
      }
    } catch {
      toast.error(isNo ? "Kunne ikke laste leads" : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchLeads(page, pageSize, search);
    }, 350);

    return () => clearTimeout(timeout);
  }, [page, pageSize, search]);

  const openDeleteModal = (lead) => {
    setSelectedLead(lead);
    setDeleteModalOpen(true);
  };

  const handleDelete =
    async () => {
      if (!selectedLead) return;

      try {
        await deleteLead(selectedLead.id);
        toast.success(
          "Lead deleted"
        );
        fetchLeads();
        setDeleteModalOpen(false);
        setSelectedLead(null);
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

      <SurfaceCard className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder={isNo ? "Søk etter leads på navn, e-post eller bedrift..." : "Search leads by name, email, or company..."}
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </label>
        </div>
      </SurfaceCard>

      {loading ? (
        <Loader message={isNo ? "Synkroniserer CRM-leads..." : "Syncing CRM leads..."} />
      ) : (
        <>
          <div className="grid gap-4 lg:hidden">

        {!loading &&
          leads.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              {t("noData")}
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
                    (isNo ? "Ingen bedrift" : "No company")}
                </p>
              </div>

              <StatusBadge
                value={lead.status}
              />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-400">
                  {t("phone")}
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {lead.phoneNumber}
                </dd>
              </div>

              <div>
                <dt className="text-slate-400">
                  {isNo ? "Verdi" : "Value"}
                </dt>
                <dd className="mt-1 font-medium text-emerald-700">
                  NOK{" "}
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
                {t("view")}
              </Link>

              <Link
                to={appRoutes.crmLeadEdit(
                  lead.id
                )}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <Pencil size={16} />
                {t("edit")}
              </Link>

              <button
                onClick={() =>
                  openDeleteModal(
                    lead
                  )
                }
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
              >
                <Trash2 size={16} />
                {t("delete")}
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
                  {t("name")}
                </th>
                <th className="p-4 text-left font-medium">
                  {t("company")}
                </th>
                <th className="p-4 text-left font-medium">
                  {t("phone")}
                </th>
                <th className="p-4 text-left font-medium">
                  {t("status")}
                </th>
                <th className="p-4 text-left font-medium">
                  {isNo ? "Verdi" : "Value"}
                </th>
                <th className="p-4 text-center font-medium">
                  {t("actions")}
                </th>
              </tr>
            </thead>

            <tbody>

              {!loading &&
                leads.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-sm text-slate-500"
                    >
                      {t("noData")}
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
                      NOK{" "}
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
                            openDeleteModal(
                              lead
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

        <div className="p-4 sm:p-5 pt-0">
          <Pagination
            currentPage={page}
            totalPages={paginationMeta.totalPages}
            totalItems={paginationMeta.total}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            itemLabel="leads"
            itemLabelNo="leads"
          />
        </div>
      </div>
    </>
  )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedLead(null);
        }}
        onConfirm={handleDelete}
        title={isNo ? "Slett Lead" : "Delete Lead"}
        message={isNo ? `Er du sikker på at du vil slette lead ${selectedLead?.fullName}? Dette kan ikke angres.` : `Are you sure you want to delete lead ${selectedLead?.fullName}? This action cannot be undone.`}
      />
    </div>
  );
};

export default LeadsPage;