import {
  useState,
} from "react";
import Button from "../ui/Button";
import {
  formControlClass,
  formLabelClass,
} from "../ui/formStyles";

const activityTypeOptions = [
  "CALL",
  "MEETING",
  "NOTE",
  "FOLLOW_UP",
  "APPOINTMENT",
];

const ActivityComposer = ({
  title = "Log Activity",
  entityIds = {},
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] =
    useState({
      type: "NOTE",
      subject: "",
      description: "",
      startsAt: "",
      endsAt: "",
    });

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

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    await onSubmit({
      type: formData.type,
      subject:
        formData.subject,
      description:
        formData.description ||
        null,
      startsAt:
        formData.startsAt ||
        null,
      endsAt:
        formData.endsAt || null,
      ...entityIds,
    });

    setFormData({
      type: "NOTE",
      subject: "",
      description: "",
      startsAt: "",
      endsAt: "",
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="activityType"
              className={
                formLabelClass
              }
            >
              Activity Type
            </label>
            <select
              id="activityType"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={
                formControlClass
              }
            >
              {activityTypeOptions.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type.replaceAll(
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
              htmlFor="activitySubject"
              className={
                formLabelClass
              }
            >
              Subject
            </label>
            <input
              id="activitySubject"
              name="subject"
              value={
                formData.subject
              }
              onChange={handleChange}
              className={
                formControlClass
              }
              placeholder="Customer follow-up after sample dispatch"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="activityStart"
              className={
                formLabelClass
              }
            >
              Start
            </label>
            <input
              id="activityStart"
              type="datetime-local"
              name="startsAt"
              value={
                formData.startsAt
              }
              onChange={handleChange}
              className={
                formControlClass
              }
            />
          </div>

          <div>
            <label
              htmlFor="activityEnd"
              className={
                formLabelClass
              }
            >
              End
            </label>
            <input
              id="activityEnd"
              type="datetime-local"
              name="endsAt"
              value={
                formData.endsAt
              }
              onChange={handleChange}
              className={
                formControlClass
              }
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="activityDescription"
            className={
              formLabelClass
            }
          >
            Notes
          </label>
          <textarea
            id="activityDescription"
            name="description"
            rows="4"
            value={
              formData.description
            }
            onChange={handleChange}
            className={
              formControlClass
            }
            placeholder="Capture meeting notes, call outcomes, next steps, or important context."
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save Activity"}
        </Button>
      </form>
    </section>
  );
};

export default ActivityComposer;
