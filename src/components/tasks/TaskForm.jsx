import Button from "../ui/Button";
import {
  formControlClass,
  formLabelClass,
} from "../ui/formStyles";
import {
  taskPriorityOptions,
  taskStatusOptions,
} from "./task.constants";
import {
  getDateValue,
} from "./taskForm.helpers";

const buildTaskPayload = (
  formData
) => ({
  title:
    formData.title.trim(),
  description:
    formData.description.trim() ||
    null,
  priority:
    formData.priority,
  status:
    formData.status,
  dueDate:
    formData.dueDate,
  assignedUserId:
    formData.assignedUserId ||
    null,
  customerId:
    formData.customerId || null,
  leadId:
    formData.leadId || null,
});

const TaskForm = ({
  formData,
  setFormData,
  onSubmit,
  loading,
  users,
  customers,
  leads,
  submitLabel,
}) => {
  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();
    onSubmit(
      buildTaskPayload(
        formData
      )
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Task Information
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Define the work item, due date, priority, and CRM linkage in one place.
          </p>
        </div>

        <div className="grid gap-4">
          <div>
            <label
              htmlFor="title"
              className={
                formLabelClass
              }
            >
              Task Title
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={
                formControlClass
              }
              placeholder="Prepare bulk order quotation"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className={
                formLabelClass
              }
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={
                formData.description
              }
              onChange={handleChange}
              className={
                formControlClass
              }
              placeholder="Add delivery notes, dependencies, and customer context."
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label
              htmlFor="priority"
              className={
                formLabelClass
              }
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={
                formData.priority
              }
              onChange={handleChange}
              className={
                formControlClass
              }
            >
              {taskPriorityOptions.map(
                (priority) => (
                  <option
                    key={priority}
                    value={
                      priority
                    }
                  >
                    {priority.replaceAll(
                      "_",
                      " "
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className={
                formLabelClass
              }
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={
                formData.status
              }
              onChange={handleChange}
              className={
                formControlClass
              }
            >
              {taskStatusOptions.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status.replaceAll(
                      "_",
                      " "
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className={
                formLabelClass
              }
            >
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={getDateValue(
                formData.dueDate
              )}
              onChange={handleChange}
              className={
                formControlClass
              }
              required
            />
          </div>

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
              name="assignedUserId"
              value={
                formData.assignedUserId
              }
              onChange={handleChange}
              className={
                formControlClass
              }
            >
              <option value="">
                Unassigned
              </option>
              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name} (
                  {user.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="customerId"
              className={
                formLabelClass
              }
            >
              Related Customer
            </label>
            <select
              id="customerId"
              name="customerId"
              value={
                formData.customerId
              }
              onChange={handleChange}
              className={
                formControlClass
              }
            >
              <option value="">
                No customer linked
              </option>
              {customers.map(
                (customer) => (
                  <option
                    key={
                      customer.id
                    }
                    value={
                      customer.id
                    }
                  >
                    {
                      customer.fullName
                    }
                    {customer.companyName
                      ? ` - ${customer.companyName}`
                      : ""}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="leadId"
              className={
                formLabelClass
              }
            >
              Related Lead
            </label>
            <select
              id="leadId"
              name="leadId"
              value={formData.leadId}
              onChange={handleChange}
              className={
                formControlClass
              }
            >
              <option value="">
                No lead linked
              </option>
              {leads.map((lead) => (
                <option
                  key={lead.id}
                  value={lead.id}
                >
                  {lead.fullName}
                  {lead.companyName
                    ? ` - ${lead.companyName}`
                    : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
