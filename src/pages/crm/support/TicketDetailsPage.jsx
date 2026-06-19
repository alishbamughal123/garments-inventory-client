import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, AlertCircle, XCircle, User, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../../components/ui/PageHeader";
import SurfaceCard from "../../../components/ui/SurfaceCard";
import Button from "../../../components/ui/Button";
import StatusBadge from "../../../components/ui/StatusBadge";
import { appRoutes } from "../../../config/routes";
import { getTicketById, updateTicket } from "../../../services/support.service";
import SupportTicketForm from "../../../components/crm/support/SupportTicketForm";

const statusIcons = {
  OPEN: <AlertCircle size={20} className="text-blue-500" />,
  IN_PROGRESS: <Clock size={20} className="text-amber-500" />,
  RESOLVED: <CheckCircle size={20} className="text-emerald-500" />,
  CLOSED: <XCircle size={20} className="text-slate-500" />,
};

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await getTicketById(id);
        setTicket(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load ticket details");
        navigate(appRoutes.crmSupport);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
    }, [id, navigate]);

    const handleUpdate = async (data) => {
    try {
      setUpdating(true);
      const response = await updateTicket(id, data);
      setTicket(response.data);
      toast.success("Ticket updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update ticket");
    } finally {
      setUpdating(false);
    }
    };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="animate-pulse text-slate-500 font-medium">Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Ticket ${ticket.ticketNumber}`}
        description={ticket.subject}
        action={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel Editing" : "Update Ticket"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(appRoutes.crmSupport)}
            >
              Back to List
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <SupportTicketForm
              initialData={{
                subject: ticket.subject,
                description: ticket.description || "",
                priority: ticket.priority,
                status: ticket.status,
                category: ticket.category || "",
                customerId: ticket.customerId || "",
                assignedToId: ticket.assignedToId || "",
              }}
              onSubmit={handleUpdate}
              loading={updating}
              submitLabel="Save Changes"
            />
          ) : (
            <SurfaceCard className="p-8">
              <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    {statusIcons[ticket.status]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{ticket.subject}</h2>
                    <p className="text-sm text-slate-500">Opened on {new Date(ticket.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <StatusBadge value={ticket.status} />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</h3>
                  <div className="rounded-xl bg-slate-50/50 p-6 text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {ticket.description || "No description provided."}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Priority</h3>
                    <p className="font-bold text-slate-900">{ticket.priority}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Category</h3>
                    <p className="font-bold text-slate-900">{ticket.category || "General"}</p>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          )}
        </div>

        <div className="space-y-6">
          <SurfaceCard className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Stakeholders</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Customer</p>
                  <p className="font-bold text-slate-900">{ticket.customer?.fullName || "General Support"}</p>
                  {ticket.customer?.email && (
                    <p className="text-sm text-slate-500">{ticket.customer.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Created By</p>
                  <p className="font-bold text-slate-900">{ticket.createdBy?.name || "System"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Assigned To</p>
                  <p className="font-bold text-slate-900">{ticket.assignedTo?.name || "Unassigned"}</p>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Timeline</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-slate-50 p-2 text-slate-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Created</p>
                  <p className="text-sm font-medium text-slate-700">{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {ticket.resolvedAt && (
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">Resolved</p>
                    <p className="text-sm font-medium text-slate-700">{new Date(ticket.resolvedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
