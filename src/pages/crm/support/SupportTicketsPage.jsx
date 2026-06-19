import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import PageHeader from "../../../components/ui/PageHeader";
import SurfaceCard from "../../../components/ui/SurfaceCard";
import { appRoutes } from "../../../config/routes";
import { getTickets, deleteTicket } from "../../../services/support.service";
import SupportTicketTable from "../../../components/crm/support/SupportTicketTable";
import DeleteModal from "../../../components/common/DeleteModal";

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async (currentSearch = search) => {
    try {
      setLoading(true);
      const response = await getTickets({
        search: currentSearch,
        status: status || undefined,
        priority: priority || undefined,
      });
      setTickets(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTickets();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, status, priority]);

  const openDeleteModal = (ticket) => {
    setSelectedTicket(ticket);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;
    try {
      await deleteTicket(selectedTicket.id);
      toast.success("Support ticket deleted successfully");
      fetchTickets();
      setDeleteModalOpen(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete ticket");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Support"
        description="Manage customer service requests and track resolution progress."
        action={
          <Button as={Link} to={appRoutes.crmSupportCreate}>
            <Plus size={16} />
            New Ticket
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
              placeholder="Search by ticket #, subject, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
      </SurfaceCard>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
          Loading support tickets...
        </div>
      ) : (
        <SupportTicketTable tickets={tickets} onDelete={openDeleteModal} />
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTicket(null);
        }}
        onConfirm={handleDelete}
        title="Delete Ticket"
        message={`Are you sure you want to delete ticket ${selectedTicket?.ticketNumber}? This action cannot be undone.`}
      />
    </div>
  );
};

export default SupportTicketsPage;
