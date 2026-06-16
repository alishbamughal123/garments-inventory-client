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
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  getLeads,
  updateLeadStage,
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
  const [leads, setLeads] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response =
          await getLeads();

        if (isMounted) {
          setLeads(
            response.data || []
          );
        }
      } catch {
        toast.error(
          "Failed to load leads"
        );
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

  const onDragEnd =
    async (result) => {
      if (
        !result.destination
      )
        return;

      const leadId =
        result.draggableId;
      const newStage =
        result.destination
          .droppableId;

      try {
        await updateLeadStage(
          leadId,
          newStage
        );

        setLeads(
          (prev) =>
            prev.map(
              (lead) =>
                lead.id ===
                leadId
                  ? {
                      ...lead,
                      status:
                        newStage,
                    }
                  : lead
            )
        );

        toast.success(
          `Lead moved to ${newStage}`
        );
      } catch {
        toast.error(
          "Failed to update stage"
        );
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
      <PageHeader
        title="Lead Pipeline Board"
      />

      <DragDropContext
        onDragEnd={
          onDragEnd
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {stages.map((stage) => {
            const stageLeads =
              leads.filter(
                (lead) =>
                  lead.status ===
                  stage
              );

            return (
              <Droppable
                key={stage}
                droppableId={stage}
              >
                {(provided) => (
                  <section
                    ref={
                      provided.innerRef
                    }
                    {...provided.droppableProps}
                    className="min-h-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <StatusBadge
                        value={stage}
                        className="text-[11px] uppercase tracking-[0.08em]"
                      />

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {
                          stageLeads.length
                        }
                      </span>
                    </div>

                    <div className="space-y-3">
                      {stageLeads.map(
                        (
                          lead,
                          index
                        ) => (
                          <Draggable
                            key={lead.id}
                            draggableId={lead.id}
                            index={index}
                          >
                            {(provided) => (
                              <article
                                ref={
                                  provided.innerRef
                                }
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                              >
                                <h4 className="font-semibold text-slate-900">
                                  {
                                    lead.fullName
                                  }
                                </h4>

                                <p className="mt-1 text-sm text-slate-500">
                                  {lead.companyName ||
                                    "No Company"}
                                </p>

                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                  <p className="break-words">
                                    {
                                      lead.phoneNumber
                                    }
                                  </p>

                                  <p className="font-medium text-emerald-700">
                                    Rs.{" "}
                                    {Number(
                                      lead.expectedDealValue ||
                                        0
                                    ).toLocaleString()}
                                  </p>
                                </div>

                                {lead.assignedTo && (
                                  <div className="mt-3 text-xs font-medium text-[var(--color-primary-ink)]">
                                    Assigned:{" "}
                                    {
                                      lead
                                        .assignedTo
                                        .name
                                    }
                                  </div>
                                )}

                                {lead.source && (
                                  <div className="mt-1 text-xs text-slate-500">
                                    Source:{" "}
                                    {
                                      lead.source
                                    }
                                  </div>
                                )}
                              </article>
                            )}
                          </Draggable>
                        )
                      )}

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
    </div>
  );
};

export default LeadPipelinePage;
