import {
useEffect,
useState,
} from "react";

import {
Link,
} from "react-router-dom";

import {
Eye,
Pencil,
Trash2,
Plus,
} from "lucide-react";

import toast from "react-hot-toast";

import {
getLeads,
deleteLead,
} from "../../services/lead.service";

const LeadsPage = () => {
const [leads, setLeads] =
useState([]);

const [loading, setLoading] =
useState(true);

const fetchLeads =
async () => {
try {
setLoading(true);


    const response =
      await getLeads();

    setLeads(
      response.data.data || []
    );
  } catch {
    toast.error(
      "Failed to load leads"
    );
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
fetchLeads();
}, []);

const handleDelete =
async (id) => {
if (
!window.confirm(
"Delete Lead?"
)
)
return;


  try {
    await deleteLead(id);

    toast.success(
      "Lead deleted"
    );

    fetchLeads();
  } catch {
    toast.error(
      "Delete failed"
    );
  }
};


return ( <div className="p-6">


  <div className="flex items-center justify-between mb-8">
    <div>
      {/* <h1 className="text-3xl font-bold">
        Leads
      </h1> */}

      <p className="text-gray-500 mt-1">
        Manage sales opportunities
      </p>
    </div>

    <Link
      to="/crm/leads/create"
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
    >
      <Plus size={18} />
      Add Lead
    </Link>
  </div>

  <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

    <table className="w-full">

      <thead className="bg-gray-50">
        <tr>
          <th className="text-left p-4">
            Name
          </th>

          <th className="text-left p-4">
            Company
          </th>

          <th className="text-left p-4">
            Phone
          </th>

          <th className="text-left p-4">
            Status
          </th>

          <th className="text-left p-4">
            Value
          </th>

          <th className="text-center p-4">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>

        {loading && (
          <tr>
            <td
              colSpan="6"
              className="p-10 text-center"
            >
              Loading...
            </td>
          </tr>
        )}

        {!loading &&
          leads.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="p-10 text-center text-gray-500"
              >
                No leads found
              </td>
            </tr>
          )}

        {leads.map(
          (lead) => (
            <tr
              key={lead.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-4 font-medium">
                {lead.fullName}
              </td>

              <td className="p-4">
                {lead.companyName ||
                  "-"}
              </td>

              <td className="p-4">
                {lead.phoneNumber}
              </td>

              <td className="p-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {lead.status}
                </span>
              </td>

              <td className="p-4 font-semibold text-green-600">
                Rs.
                {Number(
                  lead.expectedDealValue ||
                    0
                ).toLocaleString()}
              </td>

              <td className="p-4">
                <div className="flex items-center justify-center gap-4">

                  <Link
                    to={`/crm/leads/${lead.id}`}
                  >
                    <Eye
                      size={18}
                    />
                  </Link>

                  <Link
                    to={`/crm/leads/edit/${lead.id}`}
                  >
                    <Pencil
                      size={18}
                    />
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(
                        lead.id
                      )
                    }
                  >
                    <Trash2
                      size={18}
                      className="text-red-500"
                    />
                  </button>

                </div>
              </td>
            </tr>
          )
        )}
      </tbody>

    </table>
  </div>
</div>


);
};

export default LeadsPage;
