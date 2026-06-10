import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import {
  getCustomerById,
  updateCustomer,
} from "../../services/customer.service";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white";

const EditCustomerPage = () => {
  const { id } = useParams();
  const navigate =
    useNavigate();
  const [loading, setLoading] =
    useState(true);
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

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const loadCustomer =
    async () => {
      try {
        const response =
          await getCustomerById(id);

        const customer =
          response.data;

        setFormData({
          fullName:
            customer.fullName || "",
          companyName:
            customer.companyName || "",
          designation:
            customer.designation || "",
          phoneNumber:
            customer.phoneNumber || "",
          alternatePhone:
            customer.alternatePhone || "",
          email:
            customer.email || "",
          website:
            customer.website || "",
          source:
            customer.source || "",
          address:
            customer.address || "",
          city:
            customer.city || "",
          notes:
            customer.notes || "",
          customerType:
            customer.customerType ||
            "REGULAR",
          status:
            customer.status ||
            "ACTIVE",
        });
      } catch (error) {
        toast.error(
          "Failed to load customer"
        );
      } finally {
        setLoading(false);
      }
    };

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
        await updateCustomer(
          id,
          formData
        );

        toast.success(
          "Customer updated successfully"
        );

        navigate(
          `/crm/customers/${id}`
        );
      } catch (error) {
        toast.error(
          error?.response
            ?.data?.message ||
            "Update failed"
        );
      }
    };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading customer...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Edit Customer
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update contact details, status, and account information without leaving the CRM workspace.
        </p>
      </section>

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
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              placeholder="Full Name"
              className={inputClass}
            />

            <input
              name="companyName"
              value={
                formData.companyName
              }
              onChange={
                handleChange
              }
              placeholder="Company Name"
              className={inputClass}
            />

            <input
              name="designation"
              value={
                formData.designation
              }
              onChange={
                handleChange
              }
              placeholder="Designation"
              className={inputClass}
            />

            <input
              name="phoneNumber"
              value={
                formData.phoneNumber
              }
              onChange={
                handleChange
              }
              placeholder="Phone Number"
              className={inputClass}
            />

            <input
              name="alternatePhone"
              value={
                formData.alternatePhone
              }
              onChange={
                handleChange
              }
              placeholder="Alternate Phone"
              className={inputClass}
            />

            <input
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Email"
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
              value={
                formData.website
              }
              onChange={
                handleChange
              }
              placeholder="Website"
              className={inputClass}
            />

            <input
              name="source"
              value={
                formData.source
              }
              onChange={
                handleChange
              }
              placeholder="Customer Source"
              className={inputClass}
            />

            <input
              name="city"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
              placeholder="City"
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
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              rows="3"
              placeholder="Address"
              className={inputClass}
            />

            <textarea
              name="notes"
              value={
                formData.notes
              }
              onChange={
                handleChange
              }
              rows="4"
              placeholder="Notes"
              className={inputClass}
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Update Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomerPage;
