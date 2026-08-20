import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import PageHeader from "../../../components/ui/PageHeader";
import SurfaceCard from "../../../components/ui/SurfaceCard";
import Pagination from "../../../components/common/Pagination";
import { appRoutes } from "../../../config/routes";
import { useLanguage } from "../../../context/LanguageContext";
import { getTickets, deleteTicket } from "../../../services/support.service";
import SupportTicketTable from "../../../components/crm/support/SupportTicketTable";
import DeleteModal from "../../../components/common/DeleteModal";

const SupportTicketsPage = () => {
  const { t, isNo } = useLanguage();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async (pageToFetch = page, pageSizeToFetch = pageSize, currentSearch = search) => {
    try {
      setLoading(true);
      const response = await getTickets({
        page: pageToFetch,
        limit: pageSizeToFetch,
        search: currentSearch.trim(),
        status: status || undefined,
        priority: priority || undefined,
      });

      const items = Array.isArray(response.data) ? response.data : response.data?.tickets || [];
      setTickets(items);

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
    } catch (error) {
      console.error(error);
      toast.error(isNo ? "Kunne ikke laste støttehenvendelser" : "Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTickets(page, pageSize, search);
    }, 350);
    return () => clearTimeout(timeout);
  }, [page, pageSize, search, status, priority]);

  const openDeleteModal = (ticket) => {
    setSelectedTicket(ticket);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;
    try {
      await deleteTicket(selectedTicket.id);
      toast.success(isNo ? "Henvendelse slettet" : "Support ticket deleted successfully");
      fetchTickets(page, pageSize, search);
      setDeleteModalOpen(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error(error);
      toast.error(isNo ? "Kunne ikke slette henvendelse" : "Failed to delete ticket");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNo ? "Kundestøtte" : "Customer Support"}
        description={isNo ? "Administrer kundeservicehenvendelser og spor fremdrift." : "Manage customer service requests and track resolution progress."}
        action={
          <Button as={Link} to={appRoutes.crmSupportCreate}>
            <Plus size={16} />
            {isNo ? "Ny henvendelse" : "New Ticket"}
          </Button>
        }
      />

      <SurfaceCard className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={isNo ? "Søk etter henvendelse #, emne eller beskrivelse..." : "Search by ticket #, subject, or description..."}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none"
              >
                <option value="">{isNo ? "Alle statuser" : "All Statuses"}</option>
                <option value="OPEN">{isNo ? "Åpen" : "Open"}</option>
                <option value="IN_PROGRESS">{isNo ? "Under arbeid" : "In Progress"}</option>
                <option value="RESOLVED">{isNo ? "Løst" : "Resolved"}</option>
                <option value="CLOSED">{isNo ? "Lukket" : "Closed"}</option>
              </select>
            </div>

            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none"
            >
              <option value="">{isNo ? "Alle prioriteter" : "All Priorities"}</option>
              <option value="LOW">{isNo ? "Lav" : "Low"}</option>
              <option value="MEDIUM">{isNo ? "Middels" : "Medium"}</option>
              <option value="HIGH">{isNo ? "Høy" : "High"}</option>
              <option value="URGENT">{isNo ? "Kritisk" : "Urgent"}</option>
            </select>
          </div>
        </div>
      </SurfaceCard>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
          {isNo ? "Laster støttehenvendelser..." : "Loading support tickets..."}
        </div>
      ) : (
        <div className="space-y-4">
          <SupportTicketTable tickets={tickets} onDelete={openDeleteModal} />
          
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
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
              itemLabel="tickets"
              itemLabelNo="henvendelser"
            />
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTicket(null);
        }}
        onConfirm={handleDelete}
        title={isNo ? "Slett henvendelse" : "Delete Ticket"}
        message={isNo ? `Er du sikker på at du vil slette henvendelse ${selectedTicket?.ticketNumber}? Dette kan ikke angres.` : `Are you sure you want to delete ticket ${selectedTicket?.ticketNumber}? This action cannot be undone.`}
      />
    </div>
  );
};

export default SupportTicketsPage;
