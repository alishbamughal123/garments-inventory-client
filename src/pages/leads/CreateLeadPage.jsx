import {
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { appRoutes } from "../../config/routes";
import {
  createLead,
} from "../../services/lead.service";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white";

const CreateLeadPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] =
    useState(false);
  const [formData, setFormData] =
    useState({
      fullName: "",
      companyName: "",
      designation: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      source: "WEBSITE",
      expectedDealValue: 0,
      notes: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createLead(formData);
      toast.success(
        "Lead created successfully"
      );
      navigate(appRoutes.crmLeads);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create lead"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Create Lead"
        description="Capture a new opportunity with contact, source, and value details."
      />

      <form
        onSubmit={submit}
        className="space-y-6"
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Lead Information
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Full Name"
              required
            />

            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Company Name"
            />

            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={inputClass}
              placeholder="Designation"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="Email"
            />

            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputClass}
              placeholder="Phone Number"
              required
            />

            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
              placeholder="City"
            />

            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="WEBSITE">
                Website
              </option>
              <option value="FACEBOOK">
                Facebook
              </option>
              <option value="INSTAGRAM">
                Instagram
              </option>
              <option value="REFERRAL">
                Referral
              </option>
              <option value="EXHIBITION">
                Exhibition
              </option>
            </select>

            <input
              type="number"
              name="expectedDealValue"
              value={formData.expectedDealValue}
              onChange={handleChange}
              className={inputClass}
              placeholder="Expected Deal Value"
            />
          </div>

          <div className="mt-4 grid gap-4">
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={inputClass}
              placeholder="Address"
            />

            <textarea
              rows="5"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className={inputClass}
              placeholder="Notes"
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Create Lead"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateLeadPage;
