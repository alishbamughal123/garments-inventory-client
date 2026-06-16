import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../ui/Button";
import StatusBadge from "../ui/StatusBadge";
import { cn } from "../../utils/cn";
import {
  taskCalendarViews,
} from "./task.constants";

const dayLabels = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const formatDateKey = (
  value
) => {
  const date =
    new Date(value);
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

const startOfDay = (
  value
) => {
  const date =
    new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (
  value,
  amount
) => {
  const date =
    new Date(value);
  date.setDate(
    date.getDate() + amount
  );
  return date;
};

const getRangeLabel = (
  view,
  selectedDate
) => {
  const date =
    startOfDay(
      selectedDate
    );

  if (view === "DAILY") {
    return date.toLocaleDateString(
      [],
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  if (view === "WEEKLY") {
    const start =
      addDays(
        date,
        -date.getDay()
      );
    const end =
      addDays(start, 6);

    return `${start.toLocaleDateString(
      [],
      {
        month: "short",
        day: "numeric",
      }
    )} - ${end.toLocaleDateString(
      [],
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    )}`;
  }

  return date.toLocaleDateString(
    [],
    {
      month: "long",
      year: "numeric",
    }
  );
};

const getMonthGrid = (
  selectedDate
) => {
  const firstDay =
    new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );

  const start =
    addDays(
      firstDay,
      -firstDay.getDay()
    );

  return Array.from(
    { length: 42 },
    (_, index) =>
      addDays(start, index)
  );
};

const groupTasksByDate = (
  tasks
) =>
  tasks.reduce(
    (accumulator, task) => {
      const key =
        formatDateKey(
          task.dueDate
        );

      if (
        !accumulator[key]
      ) {
        accumulator[key] = [];
      }

      accumulator[key].push(task);
      return accumulator;
    },
    {}
  );

const TaskPill = ({
  task,
  onTaskClick,
}) => (
  <button
    type="button"
    onClick={() =>
      onTaskClick(task.id)
    }
    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-left transition hover:border-slate-300 hover:bg-slate-50"
  >
    <p className="truncate text-sm font-medium text-slate-900">
      {task.title}
    </p>
    <div className="mt-2 flex items-center justify-between gap-2">
      <StatusBadge
        value={task.status}
        className="px-2 py-1"
      />
      <StatusBadge
        value={task.priority}
        className="px-2 py-1"
      />
    </div>
  </button>
);

const TaskCalendar = ({
  tasks,
  view,
  selectedDate,
  onViewChange,
  onDateChange,
  onTaskClick,
}) => {
  const selected =
    startOfDay(
      selectedDate
    );
  const groupedTasks =
    groupTasksByDate(tasks);

  const moveRange = (
    direction
  ) => {
    const delta =
      direction === "next"
        ? 1
        : -1;

    const nextDate =
      new Date(selected);

    if (view === "DAILY") {
      nextDate.setDate(
        nextDate.getDate() +
          delta
      );
    } else if (
      view === "WEEKLY"
    ) {
      nextDate.setDate(
        nextDate.getDate() +
          delta * 7
      );
    } else {
      nextDate.setMonth(
        nextDate.getMonth() +
          delta
      );
    }

    onDateChange(
      formatDateKey(
        nextDate
      )
    );
  };

  const renderDailyView =
    () => {
      const key =
        formatDateKey(
          selected
        );
      const dayTasks =
        groupedTasks[key] || [];

      return (
        <div className="space-y-3">
          {dayTasks.length ===
          0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No tasks due on this day.
            </div>
          ) : (
            dayTasks.map(
              (task) => (
                <TaskPill
                  key={task.id}
                  task={task}
                  onTaskClick={
                    onTaskClick
                  }
                />
              )
            )
          )}
        </div>
      );
    };

  const renderWeeklyView =
    () => {
      const weekStart =
        addDays(
          selected,
          -selected.getDay()
        );

      return (
        <div className="grid gap-4 lg:grid-cols-7">
          {Array.from(
            { length: 7 },
            (_, index) => {
              const date =
                addDays(
                  weekStart,
                  index
                );
              const key =
                formatDateKey(
                  date
                );
              const dayTasks =
                groupedTasks[
                  key
                ] || [];

              return (
                <section
                  key={key}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {
                      dayLabels[
                        date.getDay()
                      ]
                    }
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {date.toLocaleDateString(
                      [],
                      {
                        month:
                          "short",
                        day: "numeric",
                      }
                    )}
                  </p>

                  <div className="mt-4 space-y-2">
                    {dayTasks.length ===
                    0 ? (
                      <p className="text-xs text-slate-400">
                        No tasks
                      </p>
                    ) : (
                      dayTasks.map(
                        (task) => (
                          <TaskPill
                            key={
                              task.id
                            }
                            task={task}
                            onTaskClick={
                              onTaskClick
                            }
                          />
                        )
                      )
                    )}
                  </div>
                </section>
              );
            }
          )}
        </div>
      );
    };

  const renderMonthlyView =
    () => {
      const monthGrid =
        getMonthGrid(
          selected
        );

      return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {dayLabels.map(
              (day) => (
                <div
                  key={day}
                  className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                >
                  {day}
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-7">
            {monthGrid.map(
              (date) => {
                const key =
                  formatDateKey(
                    date
                  );
                const dayTasks =
                  groupedTasks[
                    key
                  ] || [];
                const isCurrentMonth =
                  date.getMonth() ===
                  selected.getMonth();

                return (
                  <div
                    key={key}
                    className={cn(
                      "min-h-36 border-b border-r border-slate-100 p-3 align-top",
                      !isCurrentMonth &&
                        "bg-slate-50/80"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                          formatDateKey(
                            selected
                          ) === key
                            ? "bg-[var(--color-primary)] text-white"
                            : "text-slate-700"
                        )}
                      >
                        {date.getDate()}
                      </span>
                      <span className="text-xs text-slate-400">
                        {
                          dayTasks.length
                        }
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {dayTasks
                        .slice(0, 3)
                        .map(
                          (
                            task
                          ) => (
                            <TaskPill
                              key={
                                task.id
                              }
                              task={task}
                              onTaskClick={
                                onTaskClick
                              }
                            />
                          )
                        )}

                      {dayTasks.length >
                        3 && (
                        <p className="text-xs font-medium text-slate-500">
                          +
                          {dayTasks.length -
                            3}{" "}
                          more
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      );
    };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() =>
              moveRange(
                "previous"
              )
            }
          >
            <ChevronLeft
              size={16}
            />
          </Button>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              {getRangeLabel(
                view,
                selected
              )}
            </p>
            <p className="text-sm text-slate-500">
              Calendar view of task due dates.
            </p>
          </div>

          <Button
            variant="secondary"
            size="icon"
            onClick={() =>
              moveRange(
                "next"
              )
            }
          >
            <ChevronRight
              size={16}
            />
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="date"
            value={formatDateKey(
              selected
            )}
            onChange={(event) =>
              onDateChange(
                event.target.value
              )
            }
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-300"
          />

          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            {taskCalendarViews.map(
              (calendarView) => (
                <button
                  key={calendarView}
                  type="button"
                  onClick={() =>
                    onViewChange(
                      calendarView
                    )
                  }
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    view ===
                      calendarView
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                  )}
                >
                  {calendarView.slice(
                    0,
                    -2
                  )}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {view === "DAILY" &&
        renderDailyView()}
      {view === "WEEKLY" &&
        renderWeeklyView()}
      {view ===
        "MONTHLY" &&
        renderMonthlyView()}
    </section>
  );
};

export default TaskCalendar;
