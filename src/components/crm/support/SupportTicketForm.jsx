import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import { formControlClass, formLabelClass } from "../../ui/formStyles";
import { getCustomers } from "../../../services/customer.service";
import toast from "react-hot-toast";

const SupportTicketForm = ({ initialData, onSubmit, loading, submitLabel }) => {
  const [formData, setFormData] = useState(
    initialData || {
      subject: "",
      description: "",
      priority: "MEDIUM",
      status: "OPEN",
      category: "",
      customerId: "",
      assignedToId: "",
    }
  );

  const [customers, setCustomers] = useState([]);
  const [fetchingCustomers, setFetchingCustomers] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setFetchingCustomers(true);
        const response = await getCustomers();
        setCustomers(response.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load customers for dropdown");
      } finally {
        setFetchingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={formLabelClass}>Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="e.g., Unable to track order #1234"
            className={formControlClass}
          />
        </div>

        <div className="md:col-span-2">
          <label className={formLabelClass}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Detailed description of the issue..."
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>Customer (Optional)</label>
          <select
            name="customerId"
            value={formData.customerId || ""}
            onChange={handleChange}
            className={formControlClass}
            disabled={fetchingCustomers}
          >
            <option value="">General Support / Walk-in</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.fullName} {customer.companyName ? `(${customer.companyName})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={formLabelClass}>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Billing, Technical, Shipping"
            className={formControlClass}
          />
        </div>

        <div>
          <label className={formLabelClass}>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={formControlClass}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        {initialData && (
          <div>
            <label className={formLabelClass}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={formControlClass}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full sm:w-auto"
        >
          {loading ? "Processing..." : submitLabel || "Save Ticket"}
        </Button>
      </div>
    </form>
  );
};

export default SupportTicketForm;
