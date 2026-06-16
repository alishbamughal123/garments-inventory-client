import {
  useState,
} from "react";
import Button from "../ui/Button";
import {
  formControlClass,
  formLabelClass,
} from "../ui/formStyles";

const EmailComposer = ({
  title = "Send Email",
  entityIds = {},
  initialToEmail = "",
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] =
    useState({
      toEmail: initialToEmail,
      subject: "",
      bodyText: "",
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
      ...entityIds,
      toEmail:
        formData.toEmail,
      subject:
        formData.subject,
      bodyText:
        formData.bodyText,
    });

    setFormData({
      toEmail:
        formData.toEmail,
      subject: "",
      bodyText: "",
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
        <div>
          <label
            htmlFor="emailTo"
            className={
              formLabelClass
            }
          >
            To
          </label>
          <input
            id="emailTo"
            type="email"
            name="toEmail"
            value={
              formData.toEmail
            }
            onChange={handleChange}
            className={
              formControlClass
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="emailSubject"
            className={
              formLabelClass
            }
          >
            Subject
          </label>
          <input
            id="emailSubject"
            name="subject"
            value={
              formData.subject
            }
            onChange={handleChange}
            className={
              formControlClass
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="emailBody"
            className={
              formLabelClass
            }
          >
            Message
          </label>
          <textarea
            id="emailBody"
            name="bodyText"
            rows="6"
            value={
              formData.bodyText
            }
            onChange={handleChange}
            className={
              formControlClass
            }
            placeholder="Write the email body here."
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Email"}
        </Button>
      </form>
    </section>
  );
};

export default EmailComposer;
