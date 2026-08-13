import {
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  DragDropContext,
  Draggable,
  Droppable,
} from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import DeleteModal from "../../components/common/DeleteModal";
import Button from "../../components/ui/Button";
import {
  getLeads,
  updateLeadStage,
  deleteLead,
} from "../../services/lead.service";

const stages = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const LeadPipelinePage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stage Move Confirmation Modal State
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);

  // Delete Lead Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLeadToDelete, setSelectedLeadToDelete] = useState(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await getLeads();

        if (isMounted) {
          setLeads(response.data || []);
        }
      } catch {
        toast.error("Failed to load leads");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Triggered when drag finishes: Ask confirmation before updating
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStage = result.destination.droppableId;
    const lead = leads.find((l) => l.id === leadId);

    if (!lead || lead.status === newStage) return;

    setPendingMove({
      lead,
      newStage,
    });
    setMoveModalOpen(true);
  };

  const handleConfirmMove = async () => {
    if (!pendingMove) return;
    const { lead, newStage } = pendingMove;

    try {
      await updateLeadStage(lead.id, newStage);

      setLeads((prev) =>
        prev.map((item) =>
          item.id === lead.id ? { ...item, status: newStage } : item
        )
      );

      toast.success(`Lead moved to ${newStage}`);
    } catch {
      toast.error("Failed to update lead stage");
    } finally {
      setMoveModalOpen(false);
      setPendingMove(null);
    }
  };

  const openDeleteModal = (lead) => {
    setSelectedLeadToDelete(lead);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLeadToDelete) return;
    try {
      await deleteLead(selectedLeadToDelete.id);
      toast.success("Lead deleted successfully");
      setLeads((prev) => prev.filter((l) => l.id !== selectedLeadToDelete.id));
    } catch {
      toast.error("Failed to delete lead");
    } finally {
      setDeleteModalOpen(false);
      setSelectedLeadToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading Pipeline...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Lead Pipeline Board" />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {stages.map((stage) => {
            const stageLeads = leads.filter((lead) => lead.status === stage);

            return (
              <Droppable key={stage} droppableId={stage}>
                {(provided) => (
                  <section
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <StatusBadge
                        value={stage}
                        className="text-[11px] uppercase tracking-[0.08em]"
                      />

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {stageLeads.map((lead, index) => (
                        <Draggable
                          key={lead.id}
                          draggableId={lead.id}
                          index={index}
                        >
                          {(provided) => (
                            <article
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 relative group"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-slate-900">
                                    {lead.fullName}
                                  </h4>
                                  <p className="mt-0.5 text-xs text-slate-500">
                                    {lead.companyName || "No Company"}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteModal(lead);
                                  }}
                                  className="text-slate-400 hover:text-red-600 transition p-1 rounded-lg hover:bg-red-50"
                                  title="Delete Lead"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              <div className="mt-3 space-y-1 text-xs text-slate-600">
                                <p className="break-words">{lead.phoneNumber}</p>
                                <p className="font-bold text-emerald-700">
                                  NOK {Number(lead.expectedDealValue || 0).toLocaleString()}
                                </p>
                              </div>

                              {lead.assignedTo && (
                                <div className="mt-3 text-[11px] font-medium text-[var(--color-primary-ink)]">
                                  Assigned: {lead.assignedTo.name}
                                </div>
                              )}

                              {lead.source && (
                                <div className="mt-1 text-[11px] text-slate-500">
                                  Source: {lead.source}
                                </div>
                              )}
                            </article>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}

                      {stageLeads.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-400">
                          No leads in this stage
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* CONFIRM STAGE MOVE MODAL */}
      {moveModalOpen && pendingMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Confirm Lead Stage Move
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to move <strong>"{pendingMove.lead.fullName}"</strong> from stage{" "}
              <span className="font-bold text-slate-800">{pendingMove.lead.status}</span> to{" "}
              <span className="font-bold text-teal-700">{pendingMove.newStage}</span>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setMoveModalOpen(false);
                  setPendingMove(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmMove}>
                Confirm Stage Move
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE LEAD MODAL */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedLeadToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete lead ${selectedLeadToDelete?.fullName}? This action cannot be undone.`}
      />
    </div>
  );
};

export default LeadPipelinePage;

