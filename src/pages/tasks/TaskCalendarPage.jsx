import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";
import TaskCalendar from "../../components/tasks/TaskCalendar";
import PageHeader from "../../components/ui/PageHeader";
import { appRoutes } from "../../config/routes";
import {
  getTasks,
} from "../../services/task.service";

const getToday = () => {
  const date =
    new Date();
  const year =
    date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const TaskCalendarPage = () => {
  const navigate =
    useNavigate();
  const [tasks, setTasks] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [view, setView] =
    useState("MONTHLY");
  const [selectedDate, setSelectedDate] =
    useState(getToday());

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);

        const response =
          await getTasks({
            view,
            date: selectedDate,
            includeSummary:
              "false",
          });

        if (isMounted) {
          setTasks(
            response.data.items
          );
        }
      } catch {
        toast.error(
          "Failed to load task calendar"
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
  }, [view, selectedDate]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Task Module"
        title="Task Calendar"
        description="Review daily, weekly, and monthly due dates across customers, leads, and assignees."
      />

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading calendar...
        </div>
      ) : (
        <TaskCalendar
          tasks={tasks}
          view={view}
          selectedDate={
            selectedDate
          }
          onViewChange={setView}
          onDateChange={
            setSelectedDate
          }
          onTaskClick={(id) =>
            navigate(
              appRoutes.crmTaskDetails(
                id
              )
            )
          }
        />
      )}
    </div>
  );
};

export default TaskCalendarPage;
