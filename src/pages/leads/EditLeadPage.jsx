import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { appRoutes } from "../../config/routes";
import {
  getLeadById,
  updateLead,
} from "../../services/lead.service";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white";

const EditLeadPage = () => {
  const { id } =
    useParams();
  const navigate =
    useNavigate();
  const [loading, setLoading] =
    useState(true);
  const [formData, setFormData] =
    useState(null);

  async function loadLead() {
      try {
        const response =
          await getLeadById(id);

        setFormData(
          response.data
        );
      } catch {
        toast.error(
          "Failed to load lead"
        );
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    loadLead();
  }, [id]);

  const handleChange = (
    e
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const submit =
    async (e) => {
      e.preventDefault();

      try {
        await updateLead(
          id,
          formData
        );

        toast.success(
          "Lead updated successfully"
        );

        navigate(
          appRoutes.crmLeadDetails(id)
        );
      } catch {
        toast.error(
          "Update failed"
        );
      }
    };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading lead...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Edit Lead"
        description="Update lead details, notes, and deal value from a mobile-safe form."
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
              value={
                formData.fullName || ""
              }
              onChange={handleChange}
              className={inputClass}
              placeholder="Full Name"
            />

            <input
              name="companyName"
              value={
                formData.companyName || ""
              }
              onChange={handleChange}
              className={inputClass}
              placeholder="Company Name"
            />

            <input
              name="designation"
              value={
                formData.designation || ""
              }
              onChange={handleChange}
              className={inputClass}
              placeholder="Designation"
            />

            <input
              name="email"
              value={
                formData.email || ""
              }
              onChange={handleChange}
              className={inputClass}
              placeholder="Email"
            />

            <input
              name="phoneNumber"
              value={
                formData.phoneNumber || ""
              }
              onChange={handleChange}
              className={inputClass}
              placeholder="Phone"
            />

            <input
              name="city"
              value={
                formData.city || ""
              }
              onChange={handleChange}
              className={inputClass}
              placeholder="City"
            />

            <input
              type="number"
              name="expectedDealValue"
              value={
                formData.expectedDealValue || 0
              }
              onChange={handleChange}
              className={inputClass}
              placeholder="Deal Value"
            />
          </div>

          <div className="mt-4 grid gap-4">
            <textarea
              rows="5"
              name="notes"
              value={
                formData.notes || ""
              }
              onChange={handleChange}
              className={inputClass}
              placeholder="Notes"
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="submit"
          >
            Update Lead
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditLeadPage;
