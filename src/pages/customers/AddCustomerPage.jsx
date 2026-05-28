
import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import {
  createCustomer,
} from "../../services/customers.service";

const AddCustomerPage = () => {
  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      city: "",
      notes: "",
      customerType:
        "REGULAR",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !formData.fullName ||
        !formData.phoneNumber
      ) {
        toast.error(
          "Please fill required fields"
        );

        return;
      }

      try {
        setLoading(true);

        await createCustomer(
          formData
        );

        toast.success(
          "Customer added successfully"
        );

        navigate(
          "/customers"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to add customer"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          p-8
          max-w-4xl
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-8
          "
        >
          Add Customer
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          <div>

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
              "
              placeholder="Enter customer name"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={
                formData.phoneNumber
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
              "
              placeholder="03XXXXXXXXX"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
              "
              placeholder="example@email.com"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              City
            </label>

            <input
              type="text"
              name="city"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
              "
              placeholder="Enter city"
            />

          </div>

          <div className="md:col-span-2">

            <label className="block mb-2 font-medium">
              Address
            </label>

            <textarea
              rows="3"
              name="address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
              "
              placeholder="Enter address"
            />

          </div>

          <div className="md:col-span-2">

            <label className="block mb-2 font-medium">
              Notes
            </label>

            <textarea
              rows="3"
              name="notes"
              value={
                formData.notes
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
              "
              placeholder="Additional notes"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Customer Type
            </label>

            <select
              name="customerType"
              value={
                formData.customerType
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
              "
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

          </div>

          <div className="md:col-span-2">

            <button
              type="submit"
              disabled={loading}
              className="
                bg-blue-500
                hover:bg-blue-600
                text-white
                px-6
                py-3
                rounded-xl
                disabled:opacity-50
              "
            >
              {loading
                ? "Adding..."
                : "Add Customer"}
            </button>

          </div>

        </form>

      </div>

    </MainLayout>
  );
};

export default AddCustomerPage;
