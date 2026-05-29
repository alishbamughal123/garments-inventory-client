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
getLeadById,
updateLead,
} from "../../services/lead.service";

const EditLeadPage = () => {
const { id } =
useParams();

const navigate =
useNavigate();

const [loading, setLoading] =
useState(true);

const [formData, setFormData] =
useState(null);

useEffect(() => {
loadLead();
}, []);

const loadLead =
async () => {
try {
const response =
await getLeadById(id);


    setFormData(
      response.data.data
    );
  } catch {
    toast.error(
      "Failed to load lead"
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
      `/crm/leads/${id}`
    );
  } catch {
    toast.error(
      "Update failed"
    );
  }
};


if (loading)
return ( <div className="p-6">
Loading... </div>
);

return ( <div className="max-w-6xl mx-auto p-6">


  <div className="mb-6">

    <h1 className="text-3xl font-bold">
      Edit Lead
    </h1>

    <p className="text-gray-500 mt-1">
      Update lead information
    </p>

  </div>

  <form
    onSubmit={submit}
    className="bg-white border rounded-2xl p-8 shadow-sm"
  >

    <div className="grid md:grid-cols-2 gap-5">

      <div>
        <label className="block mb-2 font-medium">
          Full Name
        </label>

        <input
          name="fullName"
          value={
            formData.fullName || ""
          }
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Company Name
        </label>

        <input
          name="companyName"
          value={
            formData.companyName || ""
          }
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          name="email"
          value={
            formData.email || ""
          }
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Phone
        </label>

        <input
          name="phoneNumber"
          value={
            formData.phoneNumber || ""
          }
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          City
        </label>

        <input
          name="city"
          value={
            formData.city || ""
          }
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Deal Value
        </label>

        <input
          type="number"
          name="expectedDealValue"
          value={
            formData.expectedDealValue || 0
          }
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

    </div>

    <div className="mt-5">

      <label className="block mb-2 font-medium">
        Notes
      </label>

      <textarea
        rows="5"
        name="notes"
        value={
          formData.notes || ""
        }
        onChange={handleChange}
        className="w-full border rounded-lg px-4 py-3"
      />

    </div>

    <div className="mt-8 flex justify-end">

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
      >
        Update Lead
      </button>

    </div>

  </form>

</div>


);
};

export default EditLeadPage;
