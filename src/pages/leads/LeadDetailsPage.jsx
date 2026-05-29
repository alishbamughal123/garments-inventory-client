import {
useEffect,
useState,
} from "react";

import {
Link,
useParams,
} from "react-router-dom";

import {
User,
Building2,
Phone,
Mail,
MapPin,
DollarSign,
Pencil,
} from "lucide-react";

import toast from "react-hot-toast";

import {
getLeadById,
convertLead,
} from "../../services/lead.service";

const LeadDetailsPage = () => {
const { id } = useParams();

const [lead, setLead] =
useState(null);

const loadLead = async () => {
try {
const response =
await getLeadById(id);


  setLead(
    response.data.data
  );
} catch {
  toast.error(
    "Failed to load lead"
  );
}


};

useEffect(() => {
loadLead();
}, []);

if (!lead) {
return ( <div className="p-6">
Loading... </div>
);
}

return ( <div className="p-6">

  <div className="flex justify-between items-start mb-8">

    <div>
      <h1 className="text-3xl font-bold">
        {lead.fullName}
      </h1>

      <p className="text-gray-500 mt-1">
        {lead.companyName ||
          "No Company"}
      </p>
    </div>

    <div className="flex gap-3">

      <Link
        to={`/crm/leads/edit/${lead.id}`}
        className="bg-yellow-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
      >
        <Pencil size={16} />
        Edit
      </Link>

      <button
        onClick={async () => {
          try {
            await convertLead(
              lead.id
            );

            toast.success(
              "Lead converted successfully"
            );
          } catch {
            toast.error(
              "Conversion failed"
            );
          }
        }}
        className="bg-green-600 text-white px-4 py-2 rounded-xl"
      >
        Convert To Customer
      </button>

    </div>
  </div>

  <div className="grid md:grid-cols-3 gap-6">

    <div className="md:col-span-2 space-y-6">

      <div className="bg-white border rounded-2xl p-6">

        <h2 className="font-semibold text-lg mb-5">
          Lead Information
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div className="flex items-center gap-3">
            <User size={18} />
            <span>
              {lead.fullName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Building2 size={18} />
            <span>
              {lead.companyName ||
                "-"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Phone size={18} />
            <span>
              {lead.phoneNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={18} />
            <span>
              {lead.email ||
                "-"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={18} />
            <span>
              {lead.city ||
                "-"}
            </span>
          </div>

        </div>

      </div>

      <div className="bg-white border rounded-2xl p-6">

        <h2 className="font-semibold text-lg mb-4">
          Notes
        </h2>

        <p className="text-gray-600">
          {lead.notes ||
            "No notes available"}
        </p>

      </div>

    </div>

    <div className="space-y-6">

      <div className="bg-white border rounded-2xl p-6">

        <h3 className="font-semibold mb-4">
          Status
        </h3>

        <span className="px-3 py-2 rounded-full bg-blue-100 text-blue-700 text-sm">
          {lead.status}
        </span>

      </div>

      <div className="bg-white border rounded-2xl p-6">

        <h3 className="font-semibold mb-4">
          Deal Value
        </h3>

        <div className="flex items-center gap-2 text-green-600 font-bold text-2xl">
          <DollarSign />
          Rs.
          {Number(
            lead.expectedDealValue || 0
          ).toLocaleString()}
        </div>

      </div>

      <div className="bg-white border rounded-2xl p-6">

        <h3 className="font-semibold mb-4">
          Source
        </h3>

        <p>
          {lead.source}
        </p>

      </div>

    </div>

  </div>

</div>

);
};

export default LeadDetailsPage;
