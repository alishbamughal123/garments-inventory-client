
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createCustomer,
} from "../../services/customer.service";

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
          "/customers"
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
    <div className="max-w-5xl mx-auto p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Create Customer
        </h1>

        <p className="text-slate-500">
          Add CRM Contact
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
          placeholder="Full Name"
          value={
            formData.fullName
          }
          onChange={
            handleChange
          }
          required
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
        />

        <input
          name="website"
          placeholder="Website"
          value={
            formData.website
          }
          onChange={
            handleChange
          }
          className="border rounded-lg px-4 py-3"
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
          className="border rounded-lg px-4 py-3"
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
          placeholder="Address"
          value={
            formData.address
          }
          onChange={
            handleChange
          }
          rows="3"
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
          placeholder="Notes"
          value={
            formData.notes
          }
          onChange={
            handleChange
          }
          rows="4"
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
          Save Customer
        </button>

      </form>

    </div>
  );
};

export default CreateCustomerPage;