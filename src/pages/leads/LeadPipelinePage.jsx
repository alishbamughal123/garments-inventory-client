import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

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

  const fetchLeads =
    async () => {
      try {
        setLoading(true);

        const response =
          await getLeads();

        setLeads(
          response.data.data
        );
      } catch (error) {
        toast.error(
          "Failed to load leads"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchLeads();
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
      } catch (error) {
        toast.error(
          "Failed to update stage"
        );
      }
    };

  if (loading) {
    return (
      <div className="p-6">
        Loading Pipeline...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Lead Pipeline
        </h1>

        <p className="text-gray-500">
          Drag leads between
          stages
        </p>
      </div>

      <DragDropContext
        onDragEnd={
          onDragEnd
        }
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(
            (stage) => {
              const stageLeads =
                leads.filter(
                  (lead) =>
                    lead.status ===
                    stage
                );

              return (
                <Droppable
                  key={stage}
                  droppableId={
                    stage
                  }
                >
                  {(
                    provided
                  ) => (
                    <div
                      ref={
                        provided.innerRef
                      }
                      {...provided.droppableProps}
                      className="min-w-[320px] bg-gray-100 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-sm">
                          {stage.replace(
                            "_",
                            " "
                          )}
                        </h2>

                        <span className="bg-white px-2 py-1 rounded text-xs">
                          {
                            stageLeads.length
                          }
                        </span>
                      </div>

                      {stageLeads.map(
                        (
                          lead,
                          index
                        ) => (
                          <Draggable
                            key={
                              lead.id
                            }
                            draggableId={
                              lead.id
                            }
                            index={
                              index
                            }
                          >
                            {(
                              provided
                            ) => (
                              <div
                                ref={
                                  provided.innerRef
                                }
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white rounded-lg shadow p-4 mb-3"
                              >
                                <h3 className="font-semibold">
                                  {
                                    lead.fullName
                                  }
                                </h3>

                                <p className="text-sm text-gray-500">
                                  {lead.companyName ||
                                    "No Company"}
                                </p>

                                <p className="text-sm mt-2">
                                  📞{" "}
                                  {
                                    lead.phoneNumber
                                  }
                                </p>

                                <p className="text-sm">
                                  💰 Rs.{" "}
                                  {Number(
                                    lead.expectedDealValue ||
                                      0
                                  ).toLocaleString()}
                                </p>

                                {lead.assignedTo && (
                                  <div className="mt-2 text-xs text-blue-600">
                                    Assigned:
                                    {" "}
                                    {
                                      lead
                                        .assignedTo
                                        .name
                                    }
                                  </div>
                                )}

                                {lead.source && (
                                  <div className="mt-1 text-xs text-gray-500">
                                    Source:
                                    {" "}
                                    {
                                      lead.source
                                    }
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        )
                      )}

                      {
                        provided.placeholder
                      }
                    </div>
                  )}
                </Droppable>
              );
            }
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default LeadPipelinePage;