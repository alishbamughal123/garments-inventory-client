const getDateValue = (
  value
) => {
  if (!value) {
    return "";
  }

  if (
    typeof value ===
      "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return value;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

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

export const createInitialTaskForm =
  (task = {}) => ({
    title: task.title || "",
    description:
      task.description || "",
    priority:
      task.priority ||
      "MEDIUM",
    status:
      task.status || "PENDING",
    dueDate: getDateValue(
      task.dueDate
    ),
    assignedUserId:
      task.assignedUserId || "",
    customerId:
      task.customerId || "",
    leadId: task.leadId || "",
  });

export { getDateValue };
