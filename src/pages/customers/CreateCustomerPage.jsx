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
  createCustomer,
} from "../../services/customer.service";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white";

const CreateCustomerPage = () => {
  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      fullName: "",
      companyName: "",
      designation: "",
      phoneNumber: "",
      alternatePhone: "",
      email: "",
      website: "",
      source: "",
      address: "",
      city: "",
      notes: "",
      customerType: "REGULAR",
      status: "ACTIVE",
    });

  const handleChange = (
    e
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        await createCustomer(
          formData
        );

        toast.success(
          "Customer created successfully"
        );

        navigate(
          appRoutes.crmCustomers
        );
      } catch (error) {
        toast.error(
          error?.response
            ?.data?.message ||
            "Failed to create customer"
        );
      }
    };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Create Customer"
        description="Add a new CRM contact with company, status, and engagement details."
      />

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Contact Details
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <input
              name="fullName"
              placeholder="Full Name"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              required
              className={inputClass}
            />

            <input
              name="companyName"
              placeholder="Company Name"
              value={
                formData.companyName
              }
              onChange={
                handleChange
              }
              className={inputClass}
            />

            <input
              name="designation"
              placeholder="Designation"
              value={
                formData.designation
              }
              onChange={
                handleChange
              }
              className={inputClass}
            />

            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={
                formData.phoneNumber
              }
              onChange={
                handleChange
              }
              required
              className={inputClass}
            />

            <input
              name="alternatePhone"
              placeholder="Alternate Phone"
              value={
                formData.alternatePhone
              }
              onChange={
                handleChange
              }
              className={inputClass}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              className={inputClass}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Business Context
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <input
              name="website"
              placeholder="Website"
              value={
                formData.website
              }
              onChange={
                handleChange
              }
              className={inputClass}
            />

            <input
              name="source"
              placeholder="Customer Source"
              value={
                formData.source
              }
              onChange={
                handleChange
              }
              className={inputClass}
            />

            <input
              name="city"
              placeholder="City"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
              className={inputClass}
            />

            <select
              name="customerType"
              value={
                formData.customerType
              }
              onChange={
                handleChange
              }
              className={inputClass}
            >
              <option value="REGULAR">
                Regular
              </option>
              <option value="WHOLESALE">
                Wholesale
              </option>
              <option value="VIP">
                VIP
              </option>
            </select>

            <select
              name="status"
              value={
                formData.status
              }
              onChange={
                handleChange
              }
              className={inputClass}
            >
              <option value="ACTIVE">
                Active
              </option>
              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>

          <div className="mt-4 grid gap-4">
            <textarea
              name="address"
              placeholder="Address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              rows="3"
              className={inputClass}
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={
                formData.notes
              }
              onChange={
                handleChange
              }
              rows="4"
              className={inputClass}
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="submit"
          >
            Save Customer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomerPage;
