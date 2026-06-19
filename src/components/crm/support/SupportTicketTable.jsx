import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { appRoutes } from "../../../config/routes";
import StatusBadge from "../../ui/StatusBadge";

const priorityClasses = {
  LOW: "bg-slate-50 text-slate-600 border-slate-100",
  MEDIUM: "bg-blue-50 text-blue-600 border-blue-100",
  HIGH: "bg-orange-50 text-orange-600 border-orange-100",
  URGENT: "bg-red-50 text-red-600 border-red-100",
};

const SupportTicketTable = ({ tickets, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm no-scrollbar">
      <div className="overflow-x-auto no-scrollbar">
        <table className="min-w-full">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-4 text-left">Ticket</th>
              <th className="p-4 text-left">Subject</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Priority</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-sm text-slate-500">
                  No support tickets found
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="transition hover:bg-slate-50/50">
                  <td className="p-4 text-sm font-bold text-blue-600">
                    {ticket.ticketNumber}
                  </td>
                  <td className="p-4 text-sm text-slate-700">
                    <div className="max-w-xs truncate font-medium" title={ticket.subject}>
                      {ticket.subject}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {ticket.customer?.fullName || "General Support"}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase ${priorityClasses[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge value={ticket.status} />
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={appRoutes.crmSupportDetails(ticket.id)}
                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={appRoutes.crmSupportEdit(ticket.id)}
                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => onDelete(ticket)}
                        className="rounded-full border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportTicketTable;
