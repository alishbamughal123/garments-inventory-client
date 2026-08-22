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
  FileSpreadsheet,
  FileText,
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
import {
  exportLeadsToExcel,
  exportLeadsToPDF,
} from "../../utils/leadExport";

const INDUSTRY_TABS = [
  { id: "ALL", labelEn: "All Leads (238)", labelNo: "Alle Leads (238)", query: "" },
  { id: "HEALTHCARE", labelEn: "🏥 Healthcare & Clinics", labelNo: "🏥 Helse & Sykehus", query: "sykehus" },
  { id: "LAUNDRY", labelEn: "🧺 Commercial Laundries", labelNo: "🧺 Tekstilservice & Vaskeri", query: "Vaskeri" },
  { id: "FOOD", labelEn: "🍽️ Food & Beverage (HoReCa)", labelNo: "🍽️ Restaurant & Servering", query: "restaurant" },
  { id: "HOSPITALITY", labelEn: "🏨 Hotels, Spas & Tourism", labelNo: "🏨 Hotell, Spa & Turisme", query: "hotel" },
  { id: "FACILITY", labelEn: "🏢 Facility Management", labelNo: "🏢 Facility Management", query: "facility" },
];

const LeadsPage = () => {
  const { t, isNo } = useLanguage();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  async function fetchLeads(
    pageToFetch = page,
    pageSizeToFetch = pageSize,
    currentSearch = search,
    currentTab = activeTab,
    currentPriority = priorityFilter
  ) {
    try {
      setLoading(true);

      const tabObj = INDUSTRY_TABS.find((t) => t.id === currentTab);
      const segmentQuery = tabObj && tabObj.query ? tabObj.query : undefined;
      const priorityQuery = currentPriority !== "ALL" ? currentPriority : undefined;

      const response = await getLeads({
        page: pageToFetch,
        limit: pageSizeToFetch,
        search: currentSearch.trim(),
        segment: segmentQuery,
        priority: priorityQuery,
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
      fetchLeads(page, pageSize, search, activeTab, priorityFilter);
    }, 300);

    return () => clearTimeout(timeout);
  }, [page, pageSize, search, activeTab, priorityFilter]);

  const openDeleteModal = (lead) => {
    setSelectedLead(lead);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedLead) return;

    try {
      await deleteLead(selectedLead.id);
      toast.success(isNo ? "Lead slettet" : "Lead deleted");
      fetchLeads();
      setDeleteModalOpen(false);
      setSelectedLead(null);
    } catch {
      toast.error(isNo ? "Sletting feilet" : "Delete failed");
    }
  };

  const fetchAllMatchingLeads = async () => {
    const tabObj = INDUSTRY_TABS.find((t) => t.id === activeTab);
    const segmentQuery = tabObj && tabObj.query ? tabObj.query : undefined;
    const priorityQuery = priorityFilter !== "ALL" ? priorityFilter : undefined;

    const response = await getLeads({
      search: search.trim(),
      segment: segmentQuery,
      priority: priorityQuery,
      all: "true",
    });

    const items = Array.isArray(response.data) ? response.data : response.data?.leads || [];
    return items;
  };

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      toast.loading(
        isNo ? "Henter data og genererer Excel..." : "Fetching leads and generating Excel...",
        { id: "leads-export" }
      );
      const exportItems = await fetchAllMatchingLeads();

      if (!exportItems || exportItems.length === 0) {
        toast.error(
          isNo
            ? "Ingen leads å eksportere med valgte filtre"
            : "No leads found with selected filters",
          { id: "leads-export" }
        );
        return;
      }

      const activeTabObj = INDUSTRY_TABS.find((t) => t.id === activeTab);
      const tabLabel = isNo ? activeTabObj?.labelNo : activeTabObj?.labelEn;

      await exportLeadsToExcel({
        leads: exportItems,
        activeTabLabel: tabLabel || "All Leads",
        priorityFilter,
        searchQuery: search,
        isNo,
        fileName: `Nordic_Prowear_Leads_${activeTab}`,
      });

      toast.success(
        isNo
          ? `Excel lastet ned! (${exportItems.length} leads)`
          : `Excel downloaded! (${exportItems.length} leads)`,
        { id: "leads-export" }
      );
    } catch (err) {
      console.error(err);
      toast.error(
        isNo ? "Kunne ikke laste ned Excel" : "Failed to download Excel",
        { id: "leads-export" }
      );
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setExportingPdf(true);
      toast.loading(
        isNo ? "Henter data og genererer PDF..." : "Fetching leads and generating PDF...",
        { id: "leads-export" }
      );
      const exportItems = await fetchAllMatchingLeads();

      if (!exportItems || exportItems.length === 0) {
        toast.error(
          isNo
            ? "Ingen leads å eksportere med valgte filtre"
            : "No leads found with selected filters",
          { id: "leads-export" }
        );
        return;
      }

      const activeTabObj = INDUSTRY_TABS.find((t) => t.id === activeTab);
      const tabLabel = isNo ? activeTabObj?.labelNo : activeTabObj?.labelEn;

      await exportLeadsToPDF({
        leads: exportItems,
        activeTabLabel: tabLabel || "All Leads",
        priorityFilter,
        searchQuery: search,
        isNo,
        fileName: `Nordic_Prowear_Leads_${activeTab}`,
      });

      toast.success(
        isNo
          ? `PDF lastet ned! (${exportItems.length} leads)`
          : `PDF downloaded! (${exportItems.length} leads)`,
        { id: "leads-export" }
      );
    } catch (err) {
      console.error(err);
      toast.error(
        isNo ? "Kunne ikke laste ned PDF" : "Failed to download PDF",
        { id: "leads-export" }
      );
    } finally {
      setExportingPdf(false);
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNo ? "Salgsmuligheter & Leads" : "Leads Overview"}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleExportExcel}
              disabled={exportingExcel || loading}
              className="bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition shadow-sm"
              title={isNo ? "Last ned alle filtrerte leads til Excel" : "Download all filtered leads to Excel"}
            >
              <FileSpreadsheet size={16} className="text-emerald-600" />
              <span>
                {exportingExcel
                  ? isNo
                    ? "Eksporterer..."
                    : "Exporting..."
                  : isNo
                  ? "Last ned Excel"
                  : "Download Excel"}
              </span>
            </Button>

            <Button
              variant="secondary"
              onClick={handleExportPdf}
              disabled={exportingPdf || loading}
              className="bg-white border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition shadow-sm"
              title={isNo ? "Last ned alle filtrerte leads til PDF" : "Download all filtered leads to PDF"}
            >
              <FileText size={16} className="text-red-600" />
              <span>
                {exportingPdf
                  ? isNo
                    ? "Genererer..."
                    : "Generating..."
                  : isNo
                  ? "Last ned PDF"
                  : "Download PDF"}
              </span>
            </Button>

            <Button as={Link} to={appRoutes.crmLeadsCreate}>
              <Plus size={16} />
              <span>{isNo ? "Legg til B2B Lead" : "Add B2B Lead"}</span>
            </Button>
          </div>
        }
      />

      {/* Industry Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm scrollbar-none">
        {INDUSTRY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setPage(1);
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 font-medium transition ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {isNo ? tab.labelNo : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Search and Filters Card */}
      <SurfaceCard className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={
                isNo
                  ? "Søk på bedriftsnavn, kontaktperson, rolle, fylke, by eller bransje..."
                  : "Search by company, contact person, role, county, city, or segment..."
              }
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <div className="flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="ALL">{isNo ? "Alle prioriteter" : "All Priorities"}</option>
              <option value="A+">Prioritet: A+</option>
              <option value="A">Prioritet: A</option>
              <option value="A-">Prioritet: A-</option>
              <option value="B+">Prioritet: B+</option>
              <option value="B">Prioritet: B</option>
              <option value="Tender">{isNo ? "Anbud / Tender" : "Tender"}</option>
            </select>
          </div>
        </div>
      </SurfaceCard>

      {loading ? (
        <Loader message={isNo ? "Laster B2B-leads..." : "Loading B2B leads..."} />
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="grid gap-4 lg:hidden">
            {!loading && leads.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                {t("noData")}
              </div>
            )}

            {leads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {lead.rank && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                          #{lead.rank}
                        </span>
                      )}
                      <h3 className="truncate text-base font-semibold text-slate-900">
                        {lead.companyName || lead.fullName}
                      </h3>
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {lead.segment || (isNo ? "Uspesifisert bransje" : "Unspecified sector")}
                    </p>
                  </div>

                  {lead.priority && (
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPriorityBadgeClass(
                        lead.priority
                      )}`}
                    >
                      {lead.priority}
                    </span>
                  )}
                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
                  <p>
                    <span className="text-slate-400">{isNo ? "Kontakt:" : "Contact:"} </span>
                    <strong className="text-slate-800">{lead.fullName}</strong>
                    {lead.designation && <span className="text-slate-500"> ({lead.designation})</span>}
                  </p>
                  <p>
                    <span className="text-slate-400">{isNo ? "Tlf / E-post:" : "Phone / Email:"} </span>
                    <span>{lead.phoneNumber}</span>
                    {lead.email && <span className="text-slate-400"> • {lead.email}</span>}
                  </p>
                  {lead.revenueMnok && (
                    <p>
                      <span className="text-slate-400">{isNo ? "Omsetning:" : "Turnover:"} </span>
                      <strong className="text-emerald-700 font-semibold">{lead.revenueMnok} MNOK</strong>
                      {lead.financialYear && (
                        <span className="text-slate-400"> ({lead.financialYear})</span>
                      )}
                    </p>
                  )}
                  {lead.city && (
                    <p>
                      <span className="text-slate-400">{isNo ? "Sted / Fylke:" : "Location:"} </span>
                      <span>{lead.city}{lead.county ? `, ${lead.county}` : ""}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <StatusBadge value={lead.status} />

                  <div className="flex items-center gap-2">
                    <Link
                      to={appRoutes.crmLeadDetails(lead.id)}
                      className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      to={appRoutes.crmLeadEdit(lead.id)}
                      className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      onClick={() => openDeleteModal(lead)}
                      className="rounded-full border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4 text-left font-semibold">#</th>
                    <th className="p-4 text-left font-semibold">
                      {isNo ? "Selskap / Bedrift" : "Company / Legal Entity"}
                    </th>
                    <th className="p-4 text-left font-semibold">
                      {isNo ? "Kontaktperson & Stilling" : "Contact Person & Role"}
                    </th>
                    <th className="p-4 text-left font-semibold">
                      {isNo ? "Bransje / Segment" : "Segment / Sector"}
                    </th>
                    <th className="p-4 text-center font-semibold">
                      {isNo ? "Prioritet" : "Priority"}
                    </th>
                    <th className="p-4 text-right font-semibold">
                      {isNo ? "Omsetning (MNOK)" : "Turnover (MNOK)"}
                    </th>
                    <th className="p-4 text-left font-semibold">
                      {isNo ? "Sted / Fylke" : "Location / County"}
                    </th>
                    <th className="p-4 text-center font-semibold">
                      {t("status")}
                    </th>
                    <th className="p-4 text-center font-semibold">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {!loading && leads.length === 0 && (
                    <tr>
                      <td colSpan="9" className="p-10 text-center text-sm text-slate-500">
                        {t("noData")}
                      </td>
                    </tr>
                  )}

                  {leads.map((lead) => (
                    <tr key={lead.id} className="transition hover:bg-slate-50">
                      <td className="p-4 font-mono text-xs text-slate-400">
                        {lead.rank ? `#${lead.rank}` : "-"}
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-slate-900">
                          {lead.companyName || lead.fullName}
                        </p>
                        {lead.legalEntity && lead.legalEntity !== lead.companyName && (
                          <p className="text-xs text-slate-400 mt-0.5">{lead.legalEntity}</p>
                        )}
                      </td>

                      <td className="p-4">
                        <p className="font-medium text-slate-800">{lead.fullName}</p>
                        {lead.designation && (
                          <p className="text-xs text-slate-500 mt-0.5">{lead.designation}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-0.5">
                          {lead.phoneNumber}
                          {lead.email ? ` • ${lead.email}` : ""}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="inline-block max-w-[200px] truncate text-xs font-medium text-slate-700">
                          {lead.segment || "-"}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        {lead.priority ? (
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPriorityBadgeClass(
                              lead.priority
                            )}`}
                          >
                            {lead.priority}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="p-4 text-right font-medium">
                        {lead.revenueMnok ? (
                          <span className="font-semibold text-emerald-700">
                            {Number(lead.revenueMnok).toLocaleString("en-US", {
                              minimumFractionDigits: 1,
                              maximumFractionDigits: 1,
                            })}{" "}
                            MNOK
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="p-4 text-xs text-slate-600">
                        <p className="font-medium text-slate-800">{lead.city || "-"}</p>
                        {lead.county && <p className="text-slate-400">{lead.county}</p>}
                      </td>

                      <td className="p-4 text-center">
                        <StatusBadge value={lead.status} />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            to={appRoutes.crmLeadDetails(lead.id)}
                            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            title={isNo ? "Vis detaljer" : "View details"}
                          >
                            <Eye size={15} />
                          </Link>

                          <Link
                            to={appRoutes.crmLeadEdit(lead.id)}
                            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            title={isNo ? "Rediger" : "Edit"}
                          >
                            <Pencil size={15} />
                          </Link>

                          <button
                            onClick={() => openDeleteModal(lead)}
                            className="rounded-full border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                            title={isNo ? "Slett" : "Delete"}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
        message={
          isNo
            ? `Er du sikker på at du vil slette lead ${selectedLead?.companyName || selectedLead?.fullName}? Dette kan ikke angres.`
            : `Are you sure you want to delete lead ${selectedLead?.companyName || selectedLead?.fullName}? This action cannot be undone.`
        }
      />
    </div>
  );
};

export default LeadsPage;