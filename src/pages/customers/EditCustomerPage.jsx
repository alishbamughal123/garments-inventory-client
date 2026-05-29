
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
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Edit Customer
        </h1>

        <p className="text-slate-500">
          Update CRM Contact
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="
          bg-white
          rounded-xl
          shadow-sm
          p-6
          grid
          md:grid-cols-2
          gap-4
        "
      >

        <input
          name="fullName"
          value={
            formData.fullName
          }
          onChange={
            handleChange
          }
          placeholder="Full Name"
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
        />

        <input
          name="website"
          value={
            formData.website
          }
          onChange={
            handleChange
          }
          placeholder="Website"
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
        />

        <select
          name="customerType"
          value={
            formData.customerType
          }
          onChange={
            handleChange
          }
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
        >
          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>

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
          className="
            border
            rounded-lg
            px-4
            py-3
            md:col-span-2
          "
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
          className="
            border
            rounded-lg
            px-4
            py-3
            md:col-span-2
          "
        />

        <button
          type="submit"
          className="
            bg-blue-600
            text-white
            rounded-lg
            py-3
            md:col-span-2
          "
        >
          Update Customer
        </button>

      </form>

    </div>
  );
};

export default EditCustomerPage;
