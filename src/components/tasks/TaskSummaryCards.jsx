import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Siren,
} from "lucide-react";

const summaryCards = [
  {
    key: "totalTasks",
    label: "Total Tasks",
    icon: ClipboardList,
    iconClassName:
      "text-slate-700",
  },
  {
    key: "pendingTasks",
    label: "Pending",
    icon: Clock3,
    iconClassName:
      "text-amber-600",
  },
  {
    key: "completedTasks",
    label: "Completed",
    icon: CheckCircle2,
    iconClassName:
      "text-emerald-600",
  },
  {
    key: "overdueTasks",
    label: "Overdue",
    icon: AlertTriangle,
    iconClassName:
      "text-red-600",
  },
  {
    key: "tasksDueToday",
    label: "Due Today",
    icon: CalendarClock,
    iconClassName:
      "text-sky-600",
  },
  {
    key: "highPriorityTasks",
    label: "High Priority",
    icon: Siren,
    iconClassName:
      "text-rose-600",
  },
];

const TaskSummaryCards = ({
  summary,
}) => {
  if (!summary) {
    return null;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {summaryCards.map(
        ({
          key,
          label,
          icon: Icon,
          iconClassName,
        }) => (
          <article
            key={key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">
                  {label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {summary[key] ?? 0}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <Icon
                  size={22}
                  className={
                    iconClassName
                  }
                />
              </div>
            </div>
          </article>
        )
      )}
    </section>
  );
};

export default TaskSummaryCards;
