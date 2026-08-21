import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import {
  CalendarDays,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import SurfaceCard from "../../components/ui/SurfaceCard";
import DeleteModal from "../../components/common/DeleteModal";
import TaskSummaryCards from "../../components/tasks/TaskSummaryCards";
import Loader from "../../components/ui/Loader";
import { useLanguage } from "../../context/LanguageContext";
import {
  taskPriorityOptions,
  taskStatusOptions,
} from "../../components/tasks/task.constants";
import { appRoutes } from "../../config/routes";
import { getUsers } from "../../services/auth.service";
import Pagination from "../../components/common/Pagination";
import {
  deleteTask,
  getTasks,
} from "../../services/task.service";

const initialFilters = {
  title: "",
  customer: "",
  lead: "",
  status: "",
  priority: "",
  assignedUserId: "",
  dueDate: "",
};

const formatDate = (
  value
) =>
  value
    ? new Date(value)
        .toLocaleDateString()
    : "-";

const TasksPage = () => {
  const { t, isNo } = useLanguage();
  const navigate =
    useNavigate();
  const [tasks, setTasks] =
    useState([]);
  const [summary, setSummary] =
    useState(null);
  const [users, setUsers] =
    useState([]);
  const [filters, setFilters] =
    useState(initialFilters);
  const [loading, setLoading] =
    useState(true);
  const [
    referencesLoading,
    setReferencesLoading,
  ] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, totalPages: 1 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const loadTasks =
    async (pageToFetch = page, pageSizeToFetch = pageSize) => {
      try {
        setLoading(true);

        const response =
          await getTasks({
            ...filters,
            page: pageToFetch,
            limit: pageSizeToFetch,
          });

        const items = response.data?.items || response.data || [];
        setTasks(items);
        setSummary(
          response.data?.summary || null
        );

        const pagination = response.pagination || response.data?.pagination;
        if (pagination) {
          setPaginationMeta(pagination);
        } else {
          setPaginationMeta({
            total: items.length,
            page: pageToFetch,
            limit: pageSizeToFetch,
            totalPages: Math.max(1, Math.ceil(items.length / pageSizeToFetch)),
          });
        }
      } catch {
        toast.error(
          isNo ? "Kunne ikke laste oppgaver" : "Failed to load tasks"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadTasks(page, pageSize);
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters, page, pageSize]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setReferencesLoading(
          true
        );

        const usersResponse =
          await getUsers();

        if (isMounted) {
          setUsers(
            usersResponse.data
          );
        }
      } catch {
        if (isMounted) {
          toast.error(
            "Failed to load task references"
          );
        }
      } finally {
        if (isMounted) {
          setReferencesLoading(
            false
          );
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);

        const response =
          await getTasks(
            filters
          );

        if (isMounted) {
          setTasks(
            response.data.items
          );
          setSummary(
            response.data
              .summary
          );
        }
      } catch {
        if (isMounted) {
          toast.error(
            "Failed to load tasks"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const openDeleteModal = (task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const handleDelete =
    async () => {
      if (!selectedTask) return;

      try {
        await deleteTask(selectedTask.id);
        toast.success(
          "Task deleted"
        );
        loadTasks();
        setDeleteModalOpen(false);
        setSelectedTask(null);
      } catch {
        toast.error(
          "Failed to delete task"
        );
      }
    };

  const handleFilterChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFilters(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNo ? "Oppgaver & Påminnelser" : "Tasks & Reminders"}
        action={
          <>
            <Button
              as={Link}
              to={
                appRoutes.crmTaskCalendar
              }
              variant="secondary"
            >
              <CalendarDays
                size={16}
              />
              <span>{isNo ? "Kalender" : "Calendar"}</span>
            </Button>
            <Button
              as={Link}
              to={
                appRoutes.crmTasksCreate
              }
            >
              <Plus size={16} />
              <span>{isNo ? "Opprett oppgave" : "Create Task"}</span>
            </Button>
          </>
        }
      />

      <TaskSummaryCards
        summary={summary}
      />

      <SurfaceCard className="p-4 sm:p-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              name="title"
              value={filters.title}
              onChange={
                handleFilterChange
              }
              placeholder={isNo ? "Søk etter oppgavetittel..." : "Search by task title..."}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </label>

          <input
            type="text"
            name="customer"
            value={
              filters.customer
            }
            onChange={
              handleFilterChange
            }
            placeholder={isNo ? "Søk etter kunde..." : "Search by customer..."}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          />

          <input
            type="text"
            name="lead"
            value={filters.lead}
            onChange={
              handleFilterChange
            }
            placeholder={isNo ? "Søk etter lead..." : "Search by lead..."}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          />

          <select
            name="status"
            value={
              filters.status
            }
            onChange={
              handleFilterChange
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="">
              {isNo ? "Alle statuser" : "All Statuses"}
            </option>
            {taskStatusOptions.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {t(status)}
                </option>
              )
            )}
          </select>

          <select
            name="priority"
            value={
              filters.priority
            }
            onChange={
              handleFilterChange
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="">
              {isNo ? "Alle prioriteter" : "All Priorities"}
            </option>
            {taskPriorityOptions.map(
              (priority) => (
                <option
                  key={
                    priority
                  }
                  value={
                    priority
                  }
                >
                  {t(priority)}
                </option>
              )
            )}
          </select>

          <select
            name="assignedUserId"
            value={
              filters.assignedUserId
            }
            onChange={
              handleFilterChange
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
            disabled={
              referencesLoading
            }
          >
            <option value="">
              {isNo ? "Alle tildelte" : "All Assignees"}
            </option>
            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="dueDate"
            value={
              filters.dueDate
            }
            onChange={
              handleFilterChange
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
          />
        </div>
      </SurfaceCard>

      {loading ? (
        <Loader message={isNo ? "Synkroniserer oppgaver..." : "Syncing operational tasks..."} />
      ) : (
        <>
          <section className="grid gap-4 lg:hidden">
        {tasks.map((task) => (
          <article
            key={task.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-900">
                  {task.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {task.assignedUser
                    ?.name ||
                    "Unassigned"}
                </p>
              </div>

              <div className="flex gap-2">
                <StatusBadge
                  value={
                    task.priority
                  }
                />
                <StatusBadge
                  value={
                    task.status
                  }
                />
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-400">
                  Due
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {formatDate(
                    task.dueDate
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">
                  Customer
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {task.customer
                    ?.fullName ||
                    "-"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">
                  Lead
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {task.lead
                    ?.fullName ||
                    "-"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">
                  Reminders
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {
                    task.reminders
                      .length
                  }
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to={appRoutes.crmTaskDetails(
                  task.id
                )}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <Eye size={16} />
                View
              </Link>
              <Link
                to={appRoutes.crmTaskEdit(
                  task.id
                )}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <Pencil
                  size={16}
                />
                Edit
              </Link>
              <button
                type="button"
                onClick={() =>
                  openDeleteModal(
                    task
                  )
                }
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
              >
                <Trash2
                  size={16}
                />
                Delete
              </button>
            </div>
          </article>
        ))}

        {!loading &&
          tasks.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No tasks found.
            </div>
          )}
      </section>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-5 py-4 text-left font-medium">
                  {t("title")}
                </th>
                <th className="px-5 py-4 text-left font-medium">
                  {t("status")}
                </th>
                <th className="px-5 py-4 text-left font-medium">
                  {t("priority")}
                </th>
                <th className="px-5 py-4 text-left font-medium">
                  {t("dueDate")}
                </th>
                <th className="px-5 py-4 text-left font-medium">
                  {isNo ? "Tildelt" : "Assignee"}
                </th>
                <th className="px-5 py-4 text-left font-medium">
                  {t("customer")}
                </th>
                <th className="px-5 py-4 text-left font-medium">
                  Lead
                </th>
                <th className="px-5 py-4 text-left font-medium">
                  {t("actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          appRoutes.crmTaskDetails(
                            task.id
                          )
                        )
                      }
                      className="text-left"
                    >
                      <p className="font-medium text-slate-900">
                        {task.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {task.description ||
                          (isNo ? "Ingen beskrivelse" : "No description")}
                      </p>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      value={
                        task.status
                      }
                    />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      value={
                        task.priority
                      }
                    />
                  </td>
                  <td className="px-5 py-4 font-mono text-xs">
                    {formatDate(
                      task.dueDate
                    )}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {task.assignedUser
                      ?.name ||
                      "-"}
                  </td>
                  <td className="px-5 py-4">
                    {task.customer
                      ?.fullName ||
                      "-"}
                  </td>
                  <td className="px-5 py-4">
                    {task.lead
                      ?.fullName ||
                      "-"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={appRoutes.crmTaskDetails(
                          task.id
                        )}
                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                      >
                        <Eye
                          size={16}
                        />
                      </Link>
                      <Link
                        to={appRoutes.crmTaskEdit(
                          task.id
                        )}
                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                      >
                        <Pencil
                          size={16}
                        />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          openDeleteModal(
                            task
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
              ))}

              {!loading &&
                tasks.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      {t("noData")}
                    </td>
                  </tr>
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
            itemLabel="tasks"
            itemLabelNo="oppgaver"
          />
        </div>
      </div>
    </>
  )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={handleDelete}
        title={isNo ? "Slett oppgave" : "Delete Task"}
        message={isNo ? `Er du sikker på at du vil slette oppgaven "${selectedTask?.title}"? Dette kan ikke angres.` : `Are you sure you want to delete task "${selectedTask?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default TasksPage;
