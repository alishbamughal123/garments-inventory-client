import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
createLead,
} from "../../services/lead.service";

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

  navigate("/crm/leads");
} catch (error) {
  toast.error(
    error?.response?.data?.message ||
      "Failed to create lead"
  );
} finally {
  setLoading(false);
}


};

return ( <div className="max-w-6xl mx-auto p-6"> <div className="mb-6"> <h1 className="text-3xl font-bold">
Create Lead </h1>


    <p className="text-gray-500 mt-1">
      Add a new sales lead
    </p>
  </div>

  <form
    onSubmit={submit}
    className="bg-white border rounded-2xl shadow-sm p-8"
  >
    <div className="grid md:grid-cols-2 gap-5">

      <div>
        <label className="block mb-2 font-medium">
          Full Name
        </label>

        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Company Name
        </label>

        <input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Designation
        </label>

        <input
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Phone Number
        </label>

        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          City
        </label>

        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Lead Source
        </label>

        <select
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
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
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Expected Deal Value
        </label>

        <input
          type="number"
          name="expectedDealValue"
          value={formData.expectedDealValue}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>
    </div>

    <div className="mt-5">
      <label className="block mb-2 font-medium">
        Address
      </label>

      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-3"
      />
    </div>

    <div className="mt-5">
      <label className="block mb-2 font-medium">
        Notes
      </label>

      <textarea
        rows="5"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-3"
      />
    </div>

    <div className="mt-8 flex justify-end">
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
      >
        {loading
          ? "Saving..."
          : "Create Lead"}
      </button>
    </div>
  </form>
</div>


);
};

export default CreateLeadPage;
