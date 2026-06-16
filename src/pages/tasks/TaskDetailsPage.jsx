import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  BellRing,
  CalendarClock,
  Pencil,
  UserRoundCog,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  formControlClass,
  formLabelClass,
} from "../../components/ui/formStyles";
import { appRoutes } from "../../config/routes";
import { getUsers } from "../../services/auth.service";
import {
  addReminder,
  assignTask,
  getTaskById,
} from "../../services/task.service";

const formatDateTime = (
  value
) =>
  value
    ? new Date(value)
        .toLocaleString()
    : "-";

const formatDate = (
  value
) =>
  value
    ? new Date(value)
        .toLocaleDateString()
    : "-";

const getDefaultRecipientType =
  (task) => {
    if (task?.customer) {
      return "CUSTOMER";
    }

    if (task?.lead) {
      return "LEAD";
    }

    return "ASSIGNED_USER";
  };

const getRecipientSummary = (
  reminder
) => {
  if (
    reminder.recipientType ===
    "CUSTOM"
  ) {
    return (
      reminder.recipientEmail ||
      reminder.recipientPhone ||
      "Custom recipient"
    );
  }

  return (
    reminder.recipientEmail ||
    reminder.recipientPhone ||
    reminder.recipientType.replaceAll(
      "_",
      " "
    )
  );
};

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate =
    useNavigate();
  const [task, setTask] =
    useState(null);
  const [users, setUsers] =
    useState([]);
  const [
    assignmentLoading,
    setAssignmentLoading,
  ] = useState(false);
  const [
    reminderLoading,
    setReminderLoading,
  ] = useState(false);
  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);
  const [
    assignmentForm,
    setAssignmentForm,
  ] = useState({
    assignedUserId: "",
    note: "",
  });
  const [
    reminderForm,
    setReminderForm,
  ] = useState({
    reminderDate: "",
    reminderTime: "",
    channel: "EMAIL",
    recipientType:
      "ASSIGNED_USER",
    recipientEmail: "",
    recipientPhone: "",
    note: "",
  });

  const loadTask =
    async () => {
      try {
        const [
          taskResponse,
          usersResponse,
        ] = await Promise.all([
          getTaskById(id),
          getUsers(),
        ]);

        setTask(
          taskResponse.data
        );
        setUsers(
          usersResponse.data
        );
        setAssignmentForm({
          assignedUserId:
            taskResponse.data
              .assignedUserId ||
            "",
          note: "",
        });
        setReminderForm(
          (current) => ({
            ...current,
            recipientType:
              getDefaultRecipientType(
                taskResponse.data
              ),
          })
        );
      } catch {
        toast.error(
          "Failed to load task"
        );
        navigate(
          appRoutes.crmTasks
        );
      } finally {
        setPageLoading(
          false
        );
      }
    };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [
          taskResponse,
          usersResponse,
        ] = await Promise.all([
          getTaskById(id),
          getUsers(),
        ]);

        if (!isMounted) {
          return;
        }

        setTask(
          taskResponse.data
        );
        setUsers(
          usersResponse.data
        );
        setAssignmentForm({
          assignedUserId:
            taskResponse.data
              .assignedUserId ||
            "",
          note: "",
        });
        setReminderForm(
          (current) => ({
            ...current,
            recipientType:
              getDefaultRecipientType(
                taskResponse.data
              ),
          })
        );
      } catch {
        if (isMounted) {
          toast.error(
            "Failed to load task"
          );
          navigate(
            appRoutes.crmTasks
          );
        }
      } finally {
        if (isMounted) {
          setPageLoading(
            false
          );
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleAssignmentSubmit =
    async (event) => {
      event.preventDefault();

      try {
        setAssignmentLoading(
          true
        );
        await assignTask(id, {
          assignedUserId:
            assignmentForm.assignedUserId ||
            null,
          note:
            assignmentForm.note ||
            null,
        });

        toast.success(
          "Task assignment updated"
        );
        setAssignmentForm(
          (current) => ({
            ...current,
            note: "",
          })
        );
        loadTask();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update assignment"
        );
      } finally {
        setAssignmentLoading(
          false
        );
      }
    };

  const handleReminderSubmit =
    async (event) => {
      event.preventDefault();

      try {
        setReminderLoading(
          true
        );
        await addReminder(
          id,
          {
            ...reminderForm,
            recipientEmail:
              reminderForm.recipientEmail ||
              null,
            recipientPhone:
              reminderForm.recipientPhone ||
              null,
            note:
              reminderForm.note ||
              null,
          }
        );
        toast.success(
          "Reminder scheduled"
        );
        setReminderForm({
          reminderDate: "",
          reminderTime: "",
          channel: "EMAIL",
          recipientType:
            getDefaultRecipientType(
              task
            ),
          recipientEmail: "",
          recipientPhone: "",
          note: "",
        });
        loadTask();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to add reminder"
        );
      } finally {
        setReminderLoading(
          false
        );
      }
    };

  if (pageLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading task...
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Task Module"
        title={task.title}
        description="Review due dates, CRM links, assignment changes, reminders, and activity history."
        action={
          <Button
            as={Link}
            to={appRoutes.crmTaskEdit(
              task.id
            )}
          >
            <Pencil size={16} />
            Edit Task
          </Button>
        }
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Status
            </p>
            <div className="mt-2">
              <StatusBadge
                value={task.status}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Priority
            </p>
            <div className="mt-2">
              <StatusBadge
                value={
                  task.priority
                }
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Due Date
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {formatDate(
                task.dueDate
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Assignee
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {task.assignedUser
                ?.name ||
                "Unassigned"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Reminders
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {
                task.reminderHistory
                  .length
              }
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Task Information
            </h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-400">
                  Description
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {task.description ||
                    "No description provided."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-400">
                    Assigned User
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {task.assignedUser
                      ?.name ||
                      "Unassigned"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {task.assignedUser
                      ?.email ||
                      "No active assignee"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-400">
                    Created By
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {
                      task.createdBy
                        ?.name
                    }
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Created{" "}
                    {formatDateTime(
                      task.createdAt
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              CRM Links
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-400">
                  Related Customer
                </p>
                {task.customer ? (
                  <Link
                    to={appRoutes.crmCustomerDetails(
                      task.customer.id
                    )}
                    className="mt-2 inline-flex text-sm font-medium text-[var(--color-primary-ink)]"
                  >
                    {
                      task.customer
                        .fullName
                    }
                  </Link>
                ) : (
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    No customer linked
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-400">
                  Related Lead
                </p>
                {task.lead ? (
                  <Link
                    to={appRoutes.crmLeadDetails(
                      task.lead.id
                    )}
                    className="mt-2 inline-flex text-sm font-medium text-[var(--color-primary-ink)]"
                  >
                    {
                      task.lead
                        .fullName
                    }
                  </Link>
                ) : (
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    No lead linked
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Activity History
            </h3>

            <div className="mt-5 space-y-4">
              {task.activityHistory.map(
                (entry) => (
                  <article
                    key={`${entry.type}-${entry.createdAt}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {
                            entry.message
                          }
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">
                          {entry.type.replaceAll(
                            "_",
                            " "
                          )}
                        </p>
                      </div>

                      <p className="text-xs text-slate-500">
                        {formatDateTime(
                          entry.createdAt
                        )}
                      </p>
                    </div>

                    <p className="mt-3 text-sm text-slate-600">
                      By{" "}
                      {entry.actor
                        ?.name ||
                        "System"}
                    </p>

                    {entry.meta
                      ?.note && (
                      <p className="mt-2 text-sm text-slate-600">
                        {entry.meta.note}
                      </p>
                    )}
                  </article>
                )
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <UserRoundCog
                size={18}
                className="text-slate-500"
              />
              <h3 className="text-lg font-semibold text-slate-900">
                Reassign Task
              </h3>
            </div>

            <form
              onSubmit={
                handleAssignmentSubmit
              }
              className="mt-5 space-y-4"
            >
              <div>
                <label
                  htmlFor="assignedUserId"
                  className={
                    formLabelClass
                  }
                >
                  Assigned User
                </label>
                <select
                  id="assignedUserId"
                  value={
                    assignmentForm.assignedUserId
                  }
                  onChange={(
                    event
                  ) =>
                    setAssignmentForm(
                      (
                        current
                      ) => ({
                        ...current,
                        assignedUserId:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  className={
                    formControlClass
                  }
                >
                  <option value="">
                    Unassigned
                  </option>
                  {users.map(
                    (user) => (
                      <option
                        key={
                          user.id
                        }
                        value={
                          user.id
                        }
                      >
                        {user.name} (
                        {user.role})
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="assignmentNote"
                  className={
                    formLabelClass
                  }
                >
                  Assignment Note
                </label>
                <textarea
                  id="assignmentNote"
                  rows="4"
                  value={
                    assignmentForm.note
                  }
                  onChange={(
                    event
                  ) =>
                    setAssignmentForm(
                      (
                        current
                      ) => ({
                        ...current,
                        note: event
                          .target
                          .value,
                      })
                    )
                  }
                  className={
                    formControlClass
                  }
                  placeholder="Why is this task being reassigned?"
                />
              </div>

              <Button
                type="submit"
                disabled={
                  assignmentLoading
                }
                className="w-full"
              >
                {assignmentLoading
                  ? "Updating..."
                  : "Update Assignment"}
              </Button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <BellRing
                size={18}
                className="text-slate-500"
              />
              <h3 className="text-lg font-semibold text-slate-900">
                Schedule Reminder
              </h3>
            </div>

            <form
              onSubmit={
                handleReminderSubmit
              }
              className="mt-5 space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reminderDate"
                    className={
                      formLabelClass
                    }
                  >
                    Reminder Date
                  </label>
                  <input
                    id="reminderDate"
                    type="date"
                    value={
                      reminderForm.reminderDate
                    }
                    onChange={(
                      event
                    ) =>
                      setReminderForm(
                        (
                          current
                        ) => ({
                          ...current,
                          reminderDate:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    className={
                      formControlClass
                    }
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="reminderTime"
                    className={
                      formLabelClass
                    }
                  >
                    Reminder Time
                  </label>
                  <input
                    id="reminderTime"
                    type="time"
                    value={
                      reminderForm.reminderTime
                    }
                    onChange={(
                      event
                    ) =>
                      setReminderForm(
                        (
                          current
                        ) => ({
                          ...current,
                          reminderTime:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    className={
                      formControlClass
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reminderChannel"
                    className={
                      formLabelClass
                    }
                  >
                    Delivery Channel
                  </label>
                  <select
                    id="reminderChannel"
                    value={
                      reminderForm.channel
                    }
                    onChange={(
                      event
                    ) =>
                      setReminderForm(
                        (
                          current
                        ) => ({
                          ...current,
                          channel:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    className={
                      formControlClass
                    }
                  >
                    <option value="EMAIL">
                      Email
                    </option>
                    <option value="SMS">
                      SMS
                    </option>
                    <option value="EMAIL_AND_SMS">
                      Email + SMS
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="recipientType"
                    className={
                      formLabelClass
                    }
                  >
                    Send To
                  </label>
                  <select
                    id="recipientType"
                    value={
                      reminderForm.recipientType
                    }
                    onChange={(
                      event
                    ) =>
                      setReminderForm(
                        (
                          current
                        ) => ({
                          ...current,
                          recipientType:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    className={
                      formControlClass
                    }
                  >
                    <option value="ASSIGNED_USER">
                      Assigned User
                    </option>
                    {task.customer ? (
                      <option value="CUSTOMER">
                        Customer
                      </option>
                    ) : null}
                    {task.lead ? (
                      <option value="LEAD">
                        Lead
                      </option>
                    ) : null}
                    <option value="CUSTOM">
                      Custom Contact
                    </option>
                  </select>
                </div>
              </div>

              {reminderForm.recipientType ===
              "CUSTOM" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="recipientEmail"
                      className={
                        formLabelClass
                      }
                    >
                      Recipient Email
                    </label>
                    <input
                      id="recipientEmail"
                      type="email"
                      value={
                        reminderForm.recipientEmail
                      }
                      onChange={(
                        event
                      ) =>
                        setReminderForm(
                          (
                            current
                          ) => ({
                            ...current,
                            recipientEmail:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      className={
                        formControlClass
                      }
                      placeholder="client@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="recipientPhone"
                      className={
                        formLabelClass
                      }
                    >
                      Recipient Phone
                    </label>
                    <input
                      id="recipientPhone"
                      type="text"
                      value={
                        reminderForm.recipientPhone
                      }
                      onChange={(
                        event
                      ) =>
                        setReminderForm(
                          (
                            current
                          ) => ({
                            ...current,
                            recipientPhone:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      className={
                        formControlClass
                      }
                      placeholder="+923001234567"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  {reminderForm.recipientType ===
                    "ASSIGNED_USER" &&
                  `Assigned user: ${task.assignedUser?.email || "No email"} / ${task.assignedUser?.phoneNumber || "No phone"}`}
                  {reminderForm.recipientType ===
                    "CUSTOMER" &&
                  `Customer: ${task.customer?.email || "No email"} / ${task.customer?.phoneNumber || "No phone"}`}
                  {reminderForm.recipientType ===
                    "LEAD" &&
                  `Lead: ${task.lead?.email || "No email"} / ${task.lead?.phoneNumber || "No phone"}`}
                </div>
              )}

              <div>
                <label
                  htmlFor="reminderNote"
                  className={
                    formLabelClass
                  }
                >
                  Reminder Note
                </label>
                <textarea
                  id="reminderNote"
                  rows="4"
                  value={
                    reminderForm.note
                  }
                  onChange={(
                    event
                  ) =>
                    setReminderForm(
                      (
                        current
                      ) => ({
                        ...current,
                        note: event
                          .target
                          .value,
                      })
                    )
                  }
                  className={
                    formControlClass
                  }
                  placeholder="Call customer after sample approval."
                />
              </div>

              <Button
                type="submit"
                disabled={
                  reminderLoading
                }
                className="w-full"
              >
                {reminderLoading
                  ? "Scheduling..."
                  : "Add Reminder"}
              </Button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <CalendarClock
                size={18}
                className="text-slate-500"
              />
              <h3 className="text-lg font-semibold text-slate-900">
                Reminder History
              </h3>
            </div>

            <div className="mt-5 space-y-3">
              {task.reminderHistory
                .length ===
              0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  No reminders created yet.
                </div>
              ) : (
                task.reminderHistory.map(
                  (
                    reminder
                  ) => (
                    <article
                      key={
                        reminder.id
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {formatDate(
                              reminder.reminderDate
                            )}{" "}
                            at{" "}
                            {
                              reminder.reminderTime
                            }
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Created by{" "}
                            {
                              reminder
                                .createdBy
                                ?.name
                            }{" "}
                            •{" "}
                            {reminder.channel.replaceAll(
                              "_",
                              " "
                            )}{" "}
                            •{" "}
                            {reminder.deliveryStatus.replaceAll(
                              "_",
                              " "
                            )}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500">
                          {formatDateTime(
                            reminder.createdAt
                          )}
                        </p>
                      </div>

                      <p className="mt-3 text-sm text-slate-600">
                        {reminder.note ||
                          "No reminder note"}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Recipient:{" "}
                        {getRecipientSummary(
                          reminder
                        )}
                      </p>

                      {reminder.sentAt ? (
                        <p className="mt-1 text-xs text-emerald-600">
                          Sent{" "}
                          {formatDateTime(
                            reminder.sentAt
                          )}
                        </p>
                      ) : null}

                      {reminder.failureReason ? (
                        <p className="mt-1 text-xs text-rose-600">
                          {reminder.failureReason}
                        </p>
                      ) : null}
                    </article>
                  )
                )
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Assignment History
            </h3>

            <div className="mt-5 space-y-3">
              {task.assignmentHistory
                .length ===
              0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  No assignment changes recorded.
                </div>
              ) : (
                task.assignmentHistory.map(
                  (
                    entry
                  ) => (
                    <article
                      key={
                        entry.id
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {entry
                          .previousAssignedUser
                          ?.name ||
                          "Unassigned"}{" "}
                        to{" "}
                        {entry
                          .newAssignedUser
                          ?.name ||
                          "Unassigned"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        By{" "}
                        {
                          entry
                            .assignedBy
                            ?.name
                        }{" "}
                        on{" "}
                        {formatDateTime(
                          entry.createdAt
                        )}
                      </p>
                      <p className="mt-3 text-sm text-slate-600">
                        {entry.note ||
                          "No assignment note"}
                      </p>
                    </article>
                  )
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
